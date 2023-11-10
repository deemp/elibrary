{
  inputs = {
    flakes.url = "github:deemp/flakes/";
    pdfjs.url = "gitlab:elibrary/pdfjs?host=gitlab.pg.innopolis.university";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = {
        inherit (inputs.flakes.all)
          devshell
          drv-tools
          nixpkgs
          poetry2nix
          nix-filter
          slimlock
          nix2container
          ;
        inherit (inputs) pdfjs;
      };
      perSystem = { inputs, system }:
        let
          pkgs = import inputs.nixpkgs {
            inherit system;
            config.allowUnfree = true;
            overlays = [ inputs.nix2container.overlays.default ];
          };
          inherit (inputs.drv-tools.lib.${system}) getExe mkShellApps mkShellApp;
          inherit (inputs.devshell.lib.${system}) mkShell mkCommands mkRunCommands;
          inherit (inputs) nix-filter;

          pdfjs = "${nix-filter {
            root = inputs.pdfjs.outPath;
            include = [
              "build/generic"
            ];
          }}/build/generic";

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

          imageName = "elibrary";
          imageDependenciesPath = "dependencies";

          mkURL = host: port: "http://${host}:${port}";

          mkRunBack = { port, host, doRunInBackground ? false }: {
            runtimeInputs = [ pkgs.poetry ];
            text = ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                pkgs.stdenv.cc.cc.lib
              ]}
              export PORT=${port}
              export HOST=${host}
              ${getExe packages.writeBackDotenv}
              ${getExe packages.prodBuildFront}
              poetry run back ${if doRunInBackground then "&" else ""}
            '';
            description = "run back at ${mkURL host port}";
          };

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
              }
            ) //
            (
              mkShellApps {
                writeDotenv = {
                  text = ''
                    ${getExe packages.writeBackDotenv}
                    ${getExe packages.writeFrontDotenv}
                  '';
                  description = "write .env files for ./front and ./back";
                };

                runBackInBackground = mkRunBack { port = portBack; host = hostBack; doRunInBackground = true; };

                prodBuildPdfjs = {
                  text = ''cp -R ${pdfjs}/. ${pdfjsDir}'';
                  description = ''build pdfjs and write it to ${pdfjsDir}'';
                };

                prodBuildFront = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text =
                    let dist = "back/static/front"; in
                    ''
                      ${getExe packages.prodBuildPdfjs}
                      (cd front && npm run build)
                      rm -rf ${dist}
                      mkdir -p ${dist}
                      cp -R front/dist/. ${dist}
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
                    ${getExe packages.stop}
                    ${getExe packages.runBackInBackground}
                  '';
                  description = ''run prod site at ${mkURL hostBack portBack}'';
                };

                runFront = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text = ''(cd front && npx vite --host ${hostBack} --port ${portFront})'';
                  description = "run front site at ${mkURL hostBack portFront}";
                };

                dev = {

                  text = ''
                    ${getExe packages.prod}
                    ${getExe packages.runFront} &
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

                packageFrontDependencies =
                  let
                    inherit (pkgs.appendOverlays [ inputs.slimlock.overlays.default ]) slimlock;
                    packageLock = slimlock.buildPackageLock { src = ./front; };
                  in
                  pkgs.stdenv.mkDerivation {
                    name = "front-dependencies";
                    src = ./front;
                    installPhase = ''
                      mkdir -p $out
                      cp -R ${packageLock}/js/node_modules/. $out/node_modules
                    '';
                  };

                packageFrontDist = pkgs.buildNpmPackage {
                  name = "front-dist";
                  buildInputs = [ pkgs.nodejs ];
                  src = ./front;
                  npmBuild = "npm run build";

                  installPhase = ''
                    mkdir -p $out
                    cp -R dist/. $out
                    mkdir $out/pdfjs
                    cp -R ${pdfjs}/. $out/pdfjs
                  '';

                  npmDepsHash = "sha256-H4GA5U2F/VkKCf7zsBoqH7Xd5WImJJeT8qauPOGxCtQ=";
                };

                packageBackDependencies =
                  pkgs.stdenv.mkDerivation {
                    pname = "back-dependencies";
                    version = "0.0.1";
                    phases = [ "installPhase" ];
                    installPhase = ''
                      mkdir -p $out
                      cp -R ${packageBack [ "prod" "lint" "test" "telemetry" ]}/. $out
                    '';
                  };

                packageDependencies =
                  pkgs.stdenv.mkDerivation {
                    pname = "dependencies";
                    version = "0.0.1";
                    phases = [ "installPhase" ];
                    installPhase = ''
                      APP=$out/${imageDependenciesPath}
                      mkdir -p $APP

                      VENV=$APP/.venv
                      mkdir -p $VENV
                      cp -R ${packages.packageBackDependencies}/. $VENV

                      PDFJS=$APP/${pdfjsDir}
                      mkdir -p $PDFJS
                      cp -R ${pdfjs}/. $PDFJS

                      FRONT=$APP/front
                      mkdir -p $FRONT
                      cp -R ${packages.packageFrontDependencies}/. $FRONT

                      STATIC_FRONT=$APP/back/static/front
                      mkdir -p $STATIC_FRONT
                      cp -R ${packages.packageFrontDist}/. $STATIC_FRONT
                    '';
                  };

                runProd = mkRunBack { host = "$HOST"; port = "$PORT"; };
                runCI = mkRunBack { host = "$HOST"; port = "$PORT"; doRunInBackground = true; };

                image =
                  pkgs.nix2container.buildImage {
                    name = "elibrary";
                    tag = "latest";
                    copyToRoot = [
                      pkgs.bashInteractive
                      pkgs.coreutils
                      pkgs.poetry
                      pkgs.nodejs
                      pkgs.gnugrep
                    ];
                    layers =
                      map
                        (x: (pkgs.nix2container.buildLayer { copyToRoot = [ x ]; }))
                        [
                          packages.packageDependencies
                          packages.runProd
                          packages.runCI
                        ];
                  };

                dockerLoad = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${getExe packages.image.copyToDockerDaemon}
                    docker tag ${packages.image.imageName} deemp/${packages.image.imageName}
                  '';
                  description = "build and load image";
                };

                dockerPush = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    docker tag ${imageName} deemp/${imageName}
                    docker push deemp/${imageName}
                  '';
                  description = "push image to dockerhub";
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
                  dockerLoad
                  dockerPush
                  extractCovers
                  importCatalog
                  install
                  prod
                  prodBuildFront
                  prodBuildPdfjs
                  stop
                  writeBackDotenv
                  writeDotenv
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
