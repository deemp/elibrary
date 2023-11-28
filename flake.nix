{
  inputs = {
    flakes.url = "github:deemp/flakes";
    pdfjs = {
      url = "gitlab:elibrary/pdf.js/dist?host=gitlab.pg.innopolis.university";
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
          inherit (pkgs.lib.strings) concatStringsSep;
          inherit (pkgs.lib.attrsets) mapAttrsToList;

          pdfjs = "${nix-filter {
            root = inputs.pdfjs.outPath;
            include = [
              "build/generic"
            ];
          }}/build/generic";

          commonEnv = import ./.env.nix;

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

          mkBackRun = { env, doRunInBackground ? false }: {
            runtimeInputs = [ pkgs.poetry ];
            text = ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                pkgs.stdenv.cc.cc.lib
              ]}
              ${getExe packages.prodFrontBuild}
              ${runInEnv env ''poetry run back ${if doRunInBackground then "&" else ""}''}
            '';
            description = "run back at ${mkURL env.HOST env.PORT_BACK}";
          };

          pdfjsDir = "front/public/pdfjs";

          writeDotenv = path: env: {
            text = ''printf '${concatStringsSep "\n" (mapAttrsToList (name: value: ''${name}="${value}"'') env)}\n' > ${path}'';
            description = "write ${path}";
          };

          mkEnv = env: concatStringsSep "\n" (mapAttrsToList (name: value: ''export ${name}="''${${name}:="${value}"}"'') env);
          runInEnv = env: commands: ''
            {
              ${mkEnv env}
              ${commands}
            }
          '';

          devCompose = "docker compose -f dev.yaml";
          prodCompose = "docker compose -f prod.yaml";
          serviceName = "elibrary";

          backEnvPrefixPath = "back/.env";
          backEnv = import ./${backEnvPrefixPath}.nix { inherit pkgs; } // { inherit (commonEnv) HOST; };

          prodBackDotenvPath = "${backEnvPrefixPath}.${commonEnv.ENV_PROD}";
          prodBackEnv = backEnv // (
            import ./${prodBackDotenvPath}.nix // { inherit (commonEnv) PORT_BACK; }
          );

          devBackDotenvPath = "${backEnvPrefixPath}.${commonEnv.ENV_DEV}";
          devBackEnv = backEnv // (
            import ./${devBackDotenvPath}.nix // { inherit (commonEnv) PORT_BACK; }
          );

          devEnv = devBackEnv // devFrontEnv;
          prodEnv = prodBackEnv // prodFrontEnv;

          importCatalog = env: {
            runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
            text = ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                pkgs.stdenv.cc.cc.lib
              ]}
              poetry run import-catalog
            '';
            description = ''import books catalog into database + save sql'';
          };

          extractCovers = env: {
            runtimeInputs = [ pkgs.poetry ];
            text = ''
              poetry run extract-covers
            '';
            description = ''extract book cover images'';
          };

          devFrontDotenvPath = "front/.env.development";
          prodFrontDotenvPath = "front/.env.production";
          prodFrontEnv = import ./${prodFrontDotenvPath}.nix { prefix = commonEnv.PREFIX; };
          devFrontEnv = import ./${devFrontDotenvPath}.nix {
            prefix = commonEnv.PREFIX;
            host = commonEnv.HOST;
            portFront = commonEnv.PORT_FRONT;
            portBack = commonEnv.PORT_BACK;
          };
          withEnvDefault = env: name: ''"''${${name}:="${env.${name}}"}"'';

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

                prodPdfjsBuild = {
                  text = ''cp -R ${pdfjs}/. ${pdfjsDir}'';
                  description = ''build pdfjs and write it to ${pdfjsDir}'';
                };

                prodFrontBuild = {
                  runtimeInputs = [ pkgs.nodejs ];
                  text =
                    let dist = "back/static/front"; in
                    ''
                      ${getExe packages.prodPdfjsBuild}
                      (cd front && ${runInEnv prodFrontEnv "npm run build"})
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
                  text = ''(cd front && ${runInEnv devFrontEnv ''
                    npx vite \
                      --host ${withEnvDefault devFrontEnv "HOST"} \
                      --port ${withEnvDefault devFrontEnv "PORT_FRONT"}''})'';
                  description = "run ${frontRef devFrontEnv.HOST devFrontEnv.PORT_FRONT}";
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
                  npmBuild = runInEnv prodFrontEnv "npm run build";

                  installPhase = ''
                    mkdir -p $out
                    cp -R dist/. $out
                    mkdir $out/pdfjs
                    cp -R ${pdfjs}/. $out/pdfjs
                  '';

                  npmDepsHash = "sha256-sfKYllOuRFWSWuEnb6X6g4KDL9p32PtePRYyO7dCts4=";
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

                packageImageFrontDist =
                  pkgs.stdenv.mkDerivation {
                    pname = "dist";
                    version = "0.0.1";
                    phases = [ "installPhase" ];
                    installPhase = ''
                      APP=$out/${imageDependenciesPath}
                      mkdir -p $APP

                      STATIC_FRONT=$APP/back/static/front
                      mkdir -p $STATIC_FRONT
                      cp -R ${packages.packageFrontDist}/. $STATIC_FRONT
                    '';
                  };

                prodBackRun = mkBackRun { env = prodBackEnv; };

                devBackRun = mkBackRun { env = devBackEnv; };

                ciBackRun = mkBackRun { env = prodBackEnv; doRunInBackground = true; };

                ciBackTest = {
                  text = ''
                    ${getExe packages.ciBackRun} &> logs || (cat logs && false)
                    sleep 10
                    ${runInEnv prodBackEnv "poetry run pytest"} &> logs.test || (cat logs && cat logs.test && false)
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
                    layers = [
                      (pkgs.nix2container.buildLayer {
                        copyToRoot = [ packages.packageImageFrontDist ];
                      })
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
                    ${getExe packages.stop}
                    touch ${prodBackEnv.DB_PATH} ${prodBackEnv.DB_DUMP_PATH}
                    set -a; eval "$(sops -d back/auth.enc.env)"; set +a
                    ${runInEnv prodEnv ''
                      printf "$OTLP_GRPC_ENDPOINT\n"
                      ${prodCompose} up -dV
                    ''}
                    ${prodCompose} logs --follow ${serviceName}
                  '';
                  description =
                    let
                      prod = mkHyperRef "site" (mkURL prodBackEnv.HOST prodBackEnv.PORT_BACK);
                      monitoring = mkHyperRef "monitoring" ''${mkURL prodBackEnv.HOST commonEnv.PORT_GRAFANA}/d/fastapi-observability/fastapi-observability?orgId=1&refresh=5s'';
                    in
                    ''run ${prod} and ${monitoring}'';
                };

                prodBack = {
                  text = ''
                    ${runInEnv prodEnv "${prodCompose} down -v ${serviceName}"}
                    ${runInEnv devEnv "${devCompose} down -v ${serviceName}"}
                    touch ${prodBackEnv.DB_PATH} ${prodBackEnv.DB_DUMP_PATH}
                    ${runInEnv prodEnv "${prodCompose} up -dV ${serviceName}"}
                    ${prodCompose} logs --follow ${serviceName}
                  '';
                  description = "(reload and) run ${backRef prodBackEnv.HOST prodBackEnv.PORT_BACK}";
                };

                dev = {
                  text = ''
                    ${getExe packages.stop}
                    touch ${devBackEnv.DB_PATH} ${devBackEnv.DB_DUMP_PATH}
                    ${runInEnv devEnv "${devCompose} up -V"}
                  '';
                  description = "run ${frontRef devFrontEnv.HOST devFrontEnv.PORT_FRONT} and ${backRef devBackEnv.HOST devBackEnv.PORT_BACK}";
                };

                stop = {
                  runtimeInputs = [ pkgs.docker ];
                  text = ''
                    ${runInEnv devEnv "${devCompose} down"}
                    ${runInEnv prodEnv "${prodCompose} down"}
                    kill -9 $(lsof -t -i:${prodBackEnv.PORT_BACK}) || true
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
