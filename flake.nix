{
  inputs = {
    flakes.url = "github:deemp/flakes/";
    pdfjs.url = "gitlab:elibrary/pdfjs?host=gitlab.pg.innopolis.university";

    nixpkgs.url = "github:NixOS/nixpkgs/2bbf67d3c76927b5c3148f32c0e93c14e5dbc2d9";
    slimlock.url = "github:thomashoneyman/slimlock";
    slimlock.inputs.nixpkgs.follows = "nixpkgs";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = {
        inherit (inputs.flakes.all) devshell drv-tools nixpkgs poetry2nix nix-filter;
        inherit (inputs) slimlock;
        inherit (inputs) pdfjs;
      };
      perSystem = { inputs, system }:
        let
          pkgs = import inputs.nixpkgs {
            system = "x86_64-linux";
            config.allowUnfree = true;
          };
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps;
          inherit (inputs.devshell.lib.${system}) mkShell mkCommands mkRunCommands;
          inherit (inputs) pdfjs;

          portBack = "5000";
          portFront = "5001";
          hostBack = "0.0.0.0";

          packageBack = groups:
            let
              inherit (pkgs.appendOverlays [ inputs.poetry2nix.overlays.default ]) poetry2nix;
              p2nix = poetry2nix.overrideScope' (self: super: {
                defaultPoetryOverrides = super.defaultPoetryOverrides.extend (pyself: pysuper: {
                  baize = pysuper.baize.overridePythonAttrs
                    (old: { buildInputs = (old.buildInputs or [ ]) ++ [ pysuper.pdm-pep517 pysuper.setuptools ]; });
                  pandas = pysuper.pandas.overridePythonAttrs
                    (old: { buildInputs = (old.buildInputs or [ ]) ++ [ pysuper.meson-python ]; });
                });
              });
              app = p2nix.mkPoetryEnv {
                projectDir = ./.;
                inherit groups;
              };
            in
            app;

          imageNameCI = "elibrary-ci";
          imageNameProd = "elibrary";
          mkURL = host: port: "http://${host}:${port}";

          runBack_ = { port, host }: (mkShellApps {
            runBack = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib
                ]}
                ${getExe packages.writeBackDotenv}
                poetry run back
              '';
              description = "run back at ${mkURL host port}";
            };
          }).runBack;

          pdfjsDir = "front/public/pdfjs";

          writeDotenv = path: config: {
            text =
              let env =
                pkgs.lib.strings.concatStringsSep
                  "\n"
                  (pkgs.lib.attrsets.mapAttrsToList
                    (name: value: ''${name}="${value}"'')
                    config
                  );
              in
              ''printf '${env}\n' > ${path}'';
            description = "write ${path}";
          };

          packages =
            (
              mkShellApps {
                writeBackDotenv = writeDotenv "back/.env" (import ./back/.env.nix {
                  inherit pkgs;
                  host = hostBack;
                  port = portBack;
                });
              }
            ) //
            (
              let
                dev = "front/.env.development";
                prod = "front/.env.production";
                prefix = "/api";
              in
              mkShellApps {
                writeFrontProdDotenv = writeDotenv prod (import ./${prod}.nix { inherit prefix; });

                writeFrontDevDotenv = writeDotenv dev (import ./${dev}.nix { host = hostBack; port = portBack; inherit prefix; });

                writeFrontDotenv = {
                  text = ''
                    ${getExe packages.writeFrontDevDotenv}
                    ${getExe packages.writeFrontProdDotenv}
                  '';
                  description = ''write ${dev} and ${prod}'';
                };

                writeDotenv = {
                  text = ''
                    ${getExe packages.writeBackDotenv}
                    ${getExe packages.writeFrontDotenv}
                  '';
                  description = "write .env files for ./front and ./back";
                };
              }
            ) //
            (
              mkShellApps {
                runBack = runBack_ { port = portBack; host = hostBack; };

                prodBuildPdfjs = {
                  text = ''cp -r ${pdfjs.outPath}/build/generic/* ${pdfjsDir}'';
                  description = ''build pdfjs and write it to ${pdfjsDir}'';
                };

                prodBuildFront = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text =
                    let dist = "back/static/front"; in
                    ''
                      ${getExe packages.prodBuildPdfjs}
                      (cd front && npm run build)
                      mkdir -p ${dist}
                      cp -r front/dist/* ${dist}
                    '';
                  description = ''build front for prod'';
                };

                importCatalog = {
                  runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
                  text = ''
                    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                      pkgs.stdenv.cc.cc.lib
                    ]}
                    ${getExe packages.writeBackDotenv}
                    poetry run import-catalog
                  '';
                  description = ''import books catalog into database + save sql'';
                };

                extractCovers = {
                  runtimeInputs = [ pkgs.poetry ];
                  text = ''
                    ${getExe packages.writeBackDotenv}
                    poetry run extract-covers
                  '';
                  description = ''extract book cover images'';
                };

                prod = {
                  text = ''
                    ${getExe packages.importCatalog}
                    ${getExe packages.stop}
                    ${getExe packages.prodBuildFront}
                    ${getExe packages.runBack} &
                  '';
                  description = ''run prod site at ${mkURL hostBack portBack}'';
                };

                dev = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text = ''
                    ${getExe packages.importCatalog}
                    ${getExe packages.stop}
                    ${getExe packages.runBack} &
                    (cd front && npx vite --host ${hostBack} --port ${portFront}) &
                  '';
                  description = "run front site at ${mkURL hostBack portFront}, back site at ${mkURL hostBack portBack}";
                };

                stop = {
                  runtimeInputs = [ pkgs.lsof ];
                  text = ''
                    kill -9 $(lsof -t -i:${portBack}) || true
                    kill -9 $(lsof -t -i:${portFront}) || true
                  '';
                  description = ''stop back and front servers'';
                };

                install = {
                  runtimeInputs = [ pkgs.poetry pkgs.nodejs ];
                  text = ''
                    poetry install
                    (cd front && npm i)
                  '';
                  description = ''install dependencies for back and front'';
                };

                packageFront = pkgs.buildNpmPackage {
                  name = "front";
                  buildInputs = [ pkgs.nodejs ];
                  src = ./front;
                  npmBuild = "npm run build";

                  installPhase = ''
                    mkdir -p $out
                    cp -r dist/* $out
                    mkdir $out/pdfjs
                    cp -r ${pdfjs.outPath}/build/generic/* $out/pdfjs
                  '';

                  npmDepsHash = "sha256-Ea2g4zacZBmj5QpLXQqF29p/oPu2UYqhjsQQKQWSwxM=";
                };

                packageProd =
                  pkgs.stdenv.mkDerivation {
                    pname = "package-server";
                    version = "0.0.1";
                    phases = [ "installPhase" ];
                    installPhase = ''
                      APP=$out/elibrary
                      mkdir -p $APP

                      VENV=$APP/.venv
                      mkdir -p $VENV
                      cp -r ${packageBack [ "prod" "lint" "test" "telemetry" ]}/* $VENV
                    '';
                  };

                # data (including pre-built front) should be mounted externally
                # see docker-compose.yaml
                imageProd =
                  let
                    inherit (mkShellApps {
                      cmd.text = ''
                        cd elibrary
                        ${getExe (runBack_ { host = "$HOST"; port = "$PORT"; })}
                      '';
                    }) cmd;
                  in
                  pkgs.dockerTools.streamLayeredImage {
                    name = "elibrary";
                    tag = "latest";
                    contents = [
                      packages.packageProd
                      pkgs.bashInteractive
                      pkgs.coreutils
                      cmd
                    ];

                    config = {
                      Entrypoint = [ "bash" "-c" ];
                      Cmd = [ (getExe cmd) ];
                    };
                  };

                dockerLoadImageProd = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${packages.imageProd} | docker load
                    docker tag ${packages.imageProd.imageName} deemp/${packages.imageProd.imageName}
                  '';
                  description = "build and load prod image";
                };

                dockerPushImageProd = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    docker tag ${imageNameProd} deemp/${imageNameProd}
                    docker push deemp/${imageNameProd}
                  '';
                  description = "push prod image to dockerhub";
                };

                packageFrontCI =
                  let
                    inherit (pkgs.appendOverlays [ inputs.slimlock.overlays.default ]) slimlock;
                    packageLock = slimlock.buildPackageLock { src = ./front; };
                  in
                  pkgs.stdenv.mkDerivation {
                    name = "front-ci";
                    src = ./front;
                    installPhase = ''
                      mkdir -p $out
                      cp -r ${packageLock}/js/node_modules $out/node_modules
                    '';
                  };

                # provides dependencies

                dependenciesCI =
                  pkgs.stdenv.mkDerivation {
                    pname = "package-ci";
                    version = "0.0.1";
                    phases = [ "installPhase" ];
                    installPhase = ''
                      APP=$out/${imageNameCI}
                      mkdir -p $APP

                      VENV=$APP/.venv
                      mkdir -p $VENV
                      cp -r ${packageBack [ "prod" "lint" "test" "telemetry" ]}/* $VENV

                      PDFJS=$APP/${pdfjsDir}
                      mkdir -p $PDFJS
                      cp -r ${pdfjs.outPath}/build/generic/* $PDFJS

                      FRONT=$APP/front
                      mkdir -p $FRONT
                      cp -r ${packages.packageFrontCI}/* $FRONT
                    '';
                  };

                # data (including pre-built front) should be mounted externally
                # see docker-compose.yaml
                imageCI = pkgs.dockerTools.streamLayeredImage {
                  name = imageNameCI;
                  tag = "latest";
                  contents = [
                    packages.dependenciesCI
                    packages.prod
                    pkgs.bashInteractive
                    pkgs.coreutils
                    pkgs.poetry
                    pkgs.nodejs
                    pkgs.gnugrep
                  ];
                };

                dockerLoadImageCI = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${packages.imageCI} | docker load
                    docker tag ${packages.imageCI.imageName} deemp/${packages.imageCI.imageName}
                  '';
                  description = "load CI image";
                };

                dockerPushImageCI = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    docker tag ${imageNameCI} deemp/${imageNameCI}
                    docker push deemp/${imageNameCI}
                  '';
                  description = "push CI image to dockerhub";
                };
              }
            );
          devShells.default = mkShell {
            commands = (map (x: { package = x; }) [
              pkgs.sqlite
              pkgs.poetry
              pkgs.nodejs
              pkgs.rnix-lsp
              pkgs.nixpkgs-fmt
              pkgs.openssl
              pkgs.gnupg
              pkgs.sops
              pkgs.graphviz
              pkgs.jdk11
              pkgs.plantuml
              pkgs.docker
            ]) ++
            (
              mkRunCommands "nix-run" {
                inherit (packages)
                  dev
                  dockerLoadImageCI
                  dockerLoadImageProd
                  dockerPushImageCI
                  dockerPushImageProd
                  extractCovers
                  importCatalog
                  install
                  prod
                  prodBuildFront
                  prodBuildPdfjs
                  runBack
                  stop
                  writeBackDotenv
                  writeFrontDevDotenv
                  writeFrontDotenv
                  writeFrontProdDotenv
                  ;
              }
            );
          };
        in
        {
          inherit packages devShells;
        };
    };
}
