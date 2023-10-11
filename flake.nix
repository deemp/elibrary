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
            build-pdfjs = {
              runtimeInputs = [ pkgs.nodePackages.gulp ];
              text =
                let pdfjsStatic = "elibrary/website/static/pdfjs"; in
                ''
                  (cd pdfjs && gulp generic)
                  mkdir -p ${pdfjsStatic}
                  cp -r pdfjs/build/generic/* ${pdfjsStatic}
                '';
              description = ''build pdf.js for elibrary'';
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
            elibrary = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                kill -15 $(lsof -t -i:5000) || true
                poetry run elibrary
              '';
              description = ''run elibrary'';
            };
            stop = {
              text = ''kill -9 $(lsof -t -i:5000) || true'';
              description = ''stop elibrary server'';
            };
            expose = {
              runtimeInputs = [ pkgs.nodePackages.localtunnel pkgs.poetry ];
              text = ''
                ${getExe packages.elibrary} &
                lt -s 'elibrary-itpd' -p '5000' &
              '';
              description = ''run elibrary and expose it via localtunnel'';
            };
            build-front = {
              runtimeInputs = [ pkgs.nodejs ];
              text = ''
                (cd front && npm run build)
                cp -r front/dist elibrary/website/static/front
              '';
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
              packages.expose
            ] ++ (mkRunCommands "nix-run" packages);
          };
        in
        {
          inherit packages devShells;
        };
    };
}
