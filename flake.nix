{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/bd9b686c0168041aea600222be0805a0de6e6ab8";
    flake-utils.url = "github:numtide/flake-utils/ff7b65b44d01cf9ba6a71320833626af21126384";
    flake-compat = {
      url = "github:edolstra/flake-compat/35bb57c0c8d8b62bbfd284272c928ceb64ddbde9";
      flake = false;
    };
    flakes.url = "github:deemp/flakes/93dacca29b38865b76ef5e8c4c5c81df426cf5e8";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = { inherit (inputs.flakes.all) devshell drv-tools nixpkgs; };
      perSystem = { inputs, system }:
        let
          pkgs = inputs.nixpkgs.legacyPackages.${system};
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps;
          inherit (inputs.devshell.lib.${system}) mkShell;
          packages = mkShellApps {
            page-images.text = ''${getExe pkgs.poetry} run page-images -p ${pkgs.poppler_utils}/bin'';
          };
          devShells.default = mkShell {
            commands = map (x: { package = x; }) [
              pkgs.curl
              pkgs.jq
              pkgs.sqlite
              pkgs.poetry
              pkgs.nodejs
              pkgs.poppler_utils
            ];
          };
        in
        {
          inherit packages devShells;
        };
    };
}
