{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/bd9b686c0168041aea600222be0805a0de6e6ab8";
    flake-utils.url = "github:numtide/flake-utils/ff7b65b44d01cf9ba6a71320833626af21126384";
    flake-compat = {
      url = "github:edolstra/flake-compat/35bb57c0c8d8b62bbfd284272c928ceb64ddbde9";
      flake = false;
    };
    devshell.url = "github:numtide/devshell/cd4e2fda3150dd2f689caeac07b7f47df5197c31";
  };
  outputs = inputs: inputs.flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = inputs.nixpkgs.legacyPackages.${system};
      devshell = inputs.devshell.legacyPackages.${system};
      devShells.default = devshell.mkShell {
        commands = map (x: { package = x; }) [
          pkgs.curl
          pkgs.jq
          pkgs.sqlite
          pkgs.poetry
          pkgs.nodejs
        ];
      };
    in
    {
      inherit devShells;
    });
}
