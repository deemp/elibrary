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
          packages = mkShellApps {
            dev-build-pdfjs = {
              runtimeInputs = [ pkgs.nodePackages.gulp ];
              text =
                let dist = "front/public/pdfjs"; in
                ''
                  (cd pdfjs && gulp generic)
                  mkdir -p ${dist}
                  cp -r pdfjs/build/generic/* ${dist}
                '';
              description = ''dev build of pdf.js'';
            };
            prod-build-pdfjs = {
              runtimeInputs = [ pkgs.nodePackages.gulp ];
              text =
                let dist = "elibrary/website/static/front/assets/pdfjs"; in
                ''
                  (cd pdfjs && gulp generic)
                  mkdir -p ${dist}
                  cp -r pdfjs/build/generic/* ${dist}
                '';
              description = ''prod build of pdf.js'';
            };
            dev-build-front = {
              runtimeInputs = [ pkgs.nodejs ];
              text =
                let dist = "front/public/pdfjs"; in
                ''
                  ${packages.dev-build-pdfjs}
                  (cd front && npm run build)
                '';
              description = ''dev build of front'';
            };
            prod-build-front = {
              runtimeInputs = [ pkgs.nodejs ];
              text =
                let dist = "elibrary/website/static/front"; in
                ''
                  ${getExe packages.dev-build-pdfjs}
                  (cd front && npm run build)
                  mkdir -p ${dist}
                  cp -r front/dist/* ${dist}
                '';
              description = ''prod build of front'';
            };

            convert-xlsx-to-sql = {
              runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib
                ]}
                poetry run convert-xlsx-to-sql
              '';
              description = ''convert books.xlsx to books.sql'';
            };

            prod = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                ${getExe packages.prod-build-front}
                ${getExe packages.stop}
                poetry run elibrary
              '';
              description = ''run prod site at localhost:5000'';
            };
            dev = {
              text = ''
                ${getExe packages.stop}
                poetry run elibrary &
                (cd front && npm run dev)
              '';
              description = "run dev site at localhost:5001";
            };
            release = {
              runtimeInputs = [ pkgs.nodePackages.localtunnel ];
              text = ''
                ${getExe packages.stop}
                ${getExe packages.prod} &
                lt -s 'elibrary-itpd' -p '5000' &
              '';
              description = ''run and expose site'';
            };

            stop = {
              text = ''
                kill -9 $(lsof -t -i:5000) || true
                kill -9 $(lsof -t -i:5001) || true
              '';
              description = ''stop dev servers'';
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
