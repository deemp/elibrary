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
          pkgs = import inputs.nixpkgs {
            inherit system;
            config.permittedInsecurePackages = [ pkgs.openssl_1_1.name ];
          };
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps;
          inherit (inputs.devshell.lib.${system}) mkShell mkRunCommands;
          packages = mkShellApps {
            page-images = {
              text = ''${getExe pkgs.poetry} run page-images -p ${pkgs.poppler_utils}/bin'';
              description = "Generate images of sample books pages";
            };
            page-ocr = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib 
                  pkgs.zlib 
                  pkgs.openssl_1_1 
                  pkgs.libGL 
                  pkgs.glib
                ]}
                poetry run page-ocr
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
            ]) ++ (mkRunCommands "scripts" { inherit (packages) page-images; });
          };
        in
        {
          inherit packages devShells;
        };
    };
}
