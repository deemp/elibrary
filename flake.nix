{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/bd9b686c0168041aea600222be0805a0de6e6ab8";
    flake-utils.url = "github:numtide/flake-utils/ff7b65b44d01cf9ba6a71320833626af21126384";
    flake-compat = {
      url = "github:edolstra/flake-compat/35bb57c0c8d8b62bbfd284272c928ceb64ddbde9";
      flake = false;
    };
    flakes.url = "github:deemp/flakes/";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = { inherit (inputs.flakes.all) devshell drv-tools nixpkgs; };
      perSystem = { inputs, system }:
        let
          pkgs = inputs.nixpkgs.legacyPackages.${system};
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps;
          inherit (inputs.devshell.lib.${system}) mkShell mkCommands mkRunCommands;
          portElibrary = "5000";
          portFront = "5001";
          packages = mkShellApps {
            prod-build-front = {
              runtimeInputs = [ pkgs.nodejs pkgs.nodePackages.gulp ];
              text =
                (
                  let dist = "front/public/pdfjs"; in
                  ''
                    (cd pdfjs && gulp generic)
                    mkdir -p ${dist}
                    cp -r pdfjs/build/generic/* ${dist}
                  ''
                ) +
                (
                  let dist = "elibrary/website/static/front"; in
                  ''
                    (cd front && npm run build)
                    mkdir -p ${dist}
                    cp -r front/dist/* ${dist}
                  ''
                );
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
                poetry run elibrary
              '';
              description = ''run prod site at localhost:${portElibrary}'';
            };
            dev = {
              text = ''
                ${getExe packages."import-catalog"}
                ${getExe packages.stop}
                poetry run elibrary &
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
              description = ''run and expose site'';
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
              pkgs.jq
              pkgs.sqlite
              pkgs.poetry
              pkgs.nodejs
              pkgs.nodePackages.localtunnel
              pkgs.rnix-lsp
              pkgs.nixpkgs-fmt
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
