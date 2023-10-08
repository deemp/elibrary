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
            build-pdfjs = {
              runtimeInputs = [ pkgs.nodePackages.gulp ];
              text =
                let pdfjsStatic = "elibrary/website/static/pdfjs"; in
                ''
                  (cd pdfjs && gulp generic)
                  mkdir -p ${pdfjsStatic}
                  cp -r pdfjs/build/generic/* ${pdfjsStatic}
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
            ]) ++ (mkRunCommands "scripts" { inherit (packages) build-pdfjs; });
          };
        in
        {
          inherit packages devShells;
        };
    };
}
