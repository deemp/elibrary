{
  inputs = {
    flakes.url = "github:deemp/flakes/";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = { inherit (inputs.flakes.all) devshell drv-tools nixpkgs; };
      perSystem = { inputs, system }:
        let
          pkgs = import inputs.nixpkgs { system = "x86_64-linux"; config.allowUnfree = true; };
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps;
          inherit (inputs.devshell.lib.${system}) mkShell mkCommands mkRunCommands;
          portElibrary = "5000";
          portFront = "5001";
          runElibrary = "poetry run uvicorn --port ${portElibrary} elibrary.main:app --reload";
          packages = mkShellApps {
            prod-build-pdfjs = {
              runtimeInputs = [ pkgs.nodejs pkgs.nodePackages.gulp ];
              text =
                let dist = "front/public/pdfjs"; in
                ''
                  (cd pdfjs && gulp generic)
                  mkdir -p ${dist}
                  cp -r pdfjs/build/generic/* ${dist}
                '';
              description = ''build pdfjs for front'';
            };
            prod-build-react = {
              runtimeInputs = [ pkgs.nodejs ];
              text =
                let dist = "elibrary/static/front"; in
                ''
                  (cd front && npm run build)
                  mkdir -p ${dist}
                  cp -r front/dist/* ${dist}
                '';
              description = ''prod build of front without pdfjs build'';
            };
            prod-build-front = {
              text =
                ''
                  ${getExe packages.prod-build-pdfjs}
                  ${getExe packages.prod-build-react}
                '';
              description = ''prod build of front'';
            };

            import-catalog = {
              runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib
                ]}
                poetry run import-catalog
              '';
              description = ''import books catalog into database + save sql'';
            };

            prod = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                ${getExe packages.prod-build-front}
                ${getExe packages."import-catalog"}
                ${getExe packages.stop}
                ${runElibrary}
              '';
              description = ''run prod site at localhost:${portElibrary}'';
            };
            dev = {
              runtimeInputs = [ pkgs.poetry pkgs.nodejs ];
              text = ''
                ${getExe packages."import-catalog"}
                ${getExe packages.stop}
                ${runElibrary} &
                (cd front && npm run dev)
              '';
              description = "run dev site at localhost:${portFront}";
            };
            release = {
              runtimeInputs = [ pkgs.nodePackages.localtunnel ];
              text = ''
                ${getExe packages.stop}
                ${getExe packages.prod} &
                lt -s 'elibrary-itpd' -p ${portElibrary} &
              '';
              description = ''run and expose site via localtunnel'';
            };
            release-ngrok = {
              runtimeInputs = [ pkgs.sops pkgs.ngrok ];
              text = ''
                ${getExe packages.stop}
                sops -d elibrary/enc.auth.env > elibrary/auth.env
                ${getExe packages.prod} &
                ngrok http --domain recently-wanted-elf.ngrok-free.app ${portElibrary} &
              '';
              description = ''run and expose site via ngrok'';
            };

            stop = {
              runtimeInputs = [ pkgs.lsof ];
              text = ''
                kill -9 $(lsof -t -i:${portElibrary}) || true
                kill -9 $(lsof -t -i:${portFront}) || true
              '';
              description = ''stop dev servers'';
            };

            install = {
              runtimeInputs = [ pkgs.poetry pkgs.nodejs ];
              text = ''
                poetry install
                (cd front && npm i)
                (cd pdfjs && npm i)
              '';
              description = ''install dependencies'';
            };
          };
          devShells.default = mkShell {
            commands = (map (x: { package = x; }) [
              pkgs.curl
              pkgs.sqlite
              pkgs.poetry
              pkgs.nodejs
              pkgs.nodePackages.localtunnel
              pkgs.rnix-lsp
              pkgs.nixpkgs-fmt
              pkgs.openssl
              pkgs.gnupg
              pkgs.sops
              pkgs.ngrok
              pkgs.graphviz
              pkgs.jdk11
              pkgs.plantuml
            ]) ++ mkCommands "scripts" [
              packages.stop
            ] ++ (mkRunCommands "nix-run" packages);
          };
        in
        {
          inherit packages devShells;
        };
    };
}
