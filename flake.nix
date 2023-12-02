{
  inputs = {
    flakes.url = "github:deemp/flakes";
    pdfjs = {
      url = "gitlab:elibrary/pdf.js?host=gitlab.pg.innopolis.university";
      flake = false;
    };
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
          inherit (pkgs.lib.strings) concatStringsSep concatMapStringsSep;
          inherit (pkgs.lib.attrsets) mapAttrsToList;

          pdfjs = "${nix-filter {
            root = inputs.pdfjs.outPath;
            include = [
              "build/minified-legacy"
            ];
          }}/build/minified-legacy";

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
          mkHyperRef = text: url: '']8;;${url}\${text}]8;;\'';
          frontRef = host: port: mkHyperRef "front" (mkURL host port);
          backRef = host: port: mkHyperRef "back" (mkURL host port);

          mkBackRun = { doRunInBackground ? false }: {
            runtimeInputs = [ pkgs.poetry ];
            text = ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                pkgs.stdenv.cc.cc.lib
              ]}
              ${getExe packages.prodFrontBuild}
              poetry run back ${if doRunInBackground then "&" else ""}
            '';
            description = "run back";
          };

          pdfjsDir = "front/public/pdfjs";

          writeDotenv = path: env: {
            text = ''printf '${concatStringsSep "\n" (mapAttrsToList (name: value: ''${name}="${value}"'') env)}\n' > ${path}'';
            description = "write ${path}";
          };

          devCompose = "docker compose -f dev.yaml";
          prodCompose = "docker compose -f prod.yaml";
          devServiceName = "elibrary-dev";
          prodServiceName = "elibrary-prod";

          commonEnv = import ./.env.nix;

          backDotenvPrefixPath = "back/.env";
          backEnv = import ./${backDotenvPrefixPath}.nix { inherit pkgs; } // { inherit (commonEnv) HOST; };

          prodBackDotenvPath = "${backDotenvPrefixPath}.${commonEnv.ENV_PROD}";
          prodBackEnv = backEnv // (
            import ./${prodBackDotenvPath}.nix { env = commonEnv.ENV_PROD; } // { inherit (commonEnv) PORT_BACK; }
          );

          devBackDotenvPath = "${backDotenvPrefixPath}.${commonEnv.ENV_DEV}";
          devBackEnv = backEnv // (
            import ./${devBackDotenvPath}.nix { env = commonEnv.ENV_DEV; } // { inherit (commonEnv) PORT_BACK; }
          );

          exportEnv = sourceCommand: "set -a; ${sourceCommand}; set +a";

          importCatalog = envPath: {
            runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
            text = ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                pkgs.stdenv.cc.cc.lib
              ]}
              ${getExe packages.writeDotenv}
              ${exportEnv "source ${envPath}"}
              poetry run import-catalog
            '';
            description = ''import books catalog into database + save sql'';
          };

          extractCovers = envPath: {
            runtimeInputs = [ pkgs.poetry ];
            text = ''
              ${getExe packages.writeDotenv}
              ${exportEnv "source ${envPath}"}
              poetry run extract-covers
            '';
            description = ''extract book cover images'';
          };

          frontDotenvPrefixPath = "front/.env";
          frontEnv = import ./${frontDotenvPrefixPath}.nix;
          devFrontDotenvPath = "${frontDotenvPrefixPath}.${commonEnv.ENV_DEV}";
          prodFrontDotenvPath = "${frontDotenvPrefixPath}.${commonEnv.ENV_PROD}";
          prodFrontEnv = frontEnv // import ./${prodFrontDotenvPath}.nix { prefix = commonEnv.PREFIX; };
          devFrontEnv = frontEnv // import ./${devFrontDotenvPath}.nix {
            prefix = commonEnv.PREFIX;
            host = commonEnv.HOST;
            portFront = commonEnv.PORT_FRONT;
            portBack = commonEnv.PORT_BACK;
          };

          packages =
            (
              mkShellApps {
                prodBackWriteDotenv = writeDotenv prodBackDotenvPath prodBackEnv;

                devBackWriteDotenv = writeDotenv devBackDotenvPath devBackEnv;

                backWriteDotenv = {
                  text = ''
                    ${getExe packages.prodBackWriteDotenv}
                    ${getExe packages.devBackWriteDotenv}
                  '';
                  description = ''write ${devBackDotenvPath} and ${prodBackDotenvPath}'';
                };

                prodFrontWriteDotenv = writeDotenv prodFrontDotenvPath prodFrontEnv;

                devFrontWriteDotenv = writeDotenv devFrontDotenvPath devFrontEnv;

                frontWriteDotenv = {
                  text = ''
                    ${getExe packages.devFrontWriteDotenv}
                    ${getExe packages.prodFrontWriteDotenv}
                  '';
                  description = ''write ${devFrontDotenvPath} and ${prodFrontDotenvPath}'';
                };

                writeDotenv = {
                  text = ''
                    ${getExe packages.backWriteDotenv}
                    ${getExe packages.frontWriteDotenv}
                  '';
                  description = "write .env files for ./front and ./back";
                };

                prodFrontBuild = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text =
                    let dist = "back/static/front"; in
                    ''
                      cp -R ${pdfjs}/. ${pdfjsDir}
                      (cd front && npm run build)
                      rm -rf ${dist}
                      mkdir -p ${dist}
                      cp -R front/dist/. ${dist}
                    '';
                  description = ''build front for prod'';
                };

                devImportCatalog = importCatalog devBackDotenvPath;
                devExtractCovers = extractCovers devBackDotenvPath;

                prodImportCatalog = importCatalog prodBackDotenvPath;
                prodExtractCovers = extractCovers prodBackDotenvPath;

                devFrontRun = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text = ''(cd front && npx vite --host $HOST --port $PORT_FRONT)'';
                  description = "run front";
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
                    packageLock = (slimlock.buildPackageLock { src = ./front; }).overrideAttrs (final: prev: {
                      nativeBuildInputs = prev.nativeBuildInputs or [ ] ++ [
                        pkgs.nodePackages.node-pre-gyp
                        pkgs.python3
                        pkgs.pkg-config
                        pkgs.poppler_utils
                        pkgs.pangomm
                        pkgs.jq
                      ];
                      buildPhase = ''
                        rm ./node_modules/.bin/node-pre-gyp

                        PACKAGES="$(\
                          cat package-lock.json \
                            | jq -r '.packages 
                              | keys_unsorted 
                              | .[] 
                              | select(length > 0 and . != "node_modules/@mapbox/node-pre-gyp") 
                              | "./" + .'\
                        )"

                        npm rebuild --offline "$PACKAGES"
                      '';
                    });
                  in
                  pkgs.stdenv.mkDerivation {
                    name = "front-dependencies";
                    src = ./front;
                    installPhase = ''
                      mkdir -p $out
                      cp -R ${packageLock}/js/node_modules/. $out/node_modules
                    '';
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

                packageImageDependencies =
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
                    '';
                  };

                prodBackRun = mkBackRun { };

                devBackRun = mkBackRun { };

                ciBackRun = mkBackRun { doRunInBackground = true; };

                ciBackTest = {
                  text = ''
                    ${exportEnv "source ${prodBackDotenvPath}"}
                    ${exportEnv "source ${prodFrontDotenvPath}"}
                    ${getExe packages.ciBackRun} &> logs || (cat logs && false)
                    sleep 10
                    poetry run pytest &> logs.test || (cat logs && cat logs.test && false)
                    cat logs
                    cat logs.test
                  '';
                };

                image =
                  pkgs.nix2container.buildImage {
                    name = "elibrary";
                    tag = "latest";
                    copyToRoot = [
                      (
                        pkgs.buildEnv
                          {
                            name = "root";
                            paths = [
                              packages.ciBackRun
                              packages.ciBackTest
                              packages.devBackRun
                              packages.devFrontRun
                              packages.prodBackRun
                              pkgs.bashInteractive
                              pkgs.coreutils
                              pkgs.gnugrep
                              pkgs.htop
                              pkgs.lsof
                              pkgs.nodejs
                              pkgs.poetry
                            ];
                            pathsToLink = [ "/bin" "/dependencies" ];
                          }
                      )
                      packages.packageImageDependencies
                    ];
                  };

                imageLoad = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${getExe packages.image.copyToDockerDaemon}
                    docker tag ${packages.image.imageName} deemp/${packages.image.imageName}
                  '';
                  description = "build and load image";
                };

                imagePush = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    docker tag ${imageName} deemp/${imageName}
                    docker push deemp/${imageName}
                  '';
                  description = "push image to Docker Hub";
                };

                prod = {
                  runtimeInputs = [ pkgs.docker pkgs.sops ];
                  text = ''
                    ${getExe packages.writeDotenv}
                    ${if prodBackEnv.ENABLE_AUTH == "true" then exportEnv "source <(sops -d back/auth.enc.env)" else ""}
                    touch ${prodBackEnv.DB_PATH} ${prodBackEnv.DB_DUMP_PATH}
                    ${prodCompose} up -dV
                    ${prodCompose} logs --follow ${prodServiceName}
                  '';
                  description =
                    let
                      prod = backRef commonEnv.HOST commonEnv.PROD_HOST_PORT_BACK;
                      monitoring = mkHyperRef "monitoring" ''${mkURL commonEnv.HOST commonEnv.PROD_HOST_PORT_GRAFANA}/d/fastapi-observability/fastapi-observability?orgId=1&refresh=5s'';
                    in
                    ''reload and run ${prod} and ${monitoring}'';
                };

                prodBack = {
                  text = ''
                    ${getExe packages.writeDotenv}
                    ${if prodBackEnv.ENABLE_AUTH == "true" then exportEnv "source <(sops -d back/auth.enc.env)" else ""}
                    touch ${prodBackEnv.DB_PATH} ${prodBackEnv.DB_DUMP_PATH}
                    ${prodCompose} up -dV ${prodServiceName}
                    ${prodCompose} logs --follow ${prodServiceName}
                  '';
                  description =
                    let
                      back = backRef commonEnv.HOST commonEnv.PROD_HOST_PORT_BACK;
                    in
                    "reload and run ${back}";
                };

                dev = {
                  text = ''
                    ${getExe packages.writeDotenv}
                    touch ${devBackEnv.DB_PATH} ${devBackEnv.DB_DUMP_PATH}
                    ${devCompose} up -V
                  '';
                  description =
                    let
                      front = frontRef commonEnv.HOST commonEnv.DEV_HOST_PORT_FRONT;
                      back = backRef commonEnv.HOST commonEnv.DEV_HOST_PORT_BACK;
                    in
                    "run ${front} and ${back}";
                };

                stop = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${getExe packages.writeDotenv}
                    ${devCompose} down
                    ${prodCompose} down
                    ${concatMapStringsSep "\n" (x: "kill -9 $(lsof -t -i:${x}) || true") [
                        commonEnv.PROD_HOST_PORT_BACK
                        commonEnv.DEV_HOST_PORT_FRONT
                        commonEnv.DEV_HOST_PORT_BACK
                      ]
                    }
                  '';
                  description = ''stop prod and dev containers'';
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
                  devExtractCovers
                  devImportCatalog
                  imageLoad
                  imagePush
                  install
                  prod
                  prodBack
                  prodExtractCovers
                  prodImportCatalog
                  stop
                  writeDotenv
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
