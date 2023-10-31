{
  inputs = {
    flakes.url = "github:deemp/flakes/";
    pdfjs.url = "gitlab:elibrary/pdfjs?host=gitlab.pg.innopolis.university";
  };
  outputs = inputs: inputs.flakes.makeFlake
    {
      inputs = {
        inherit (inputs.flakes.all) devshell drv-tools nixpkgs poetry2nix nix-filter;
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
          portElibrary = "5000";
          portFront = "5001";
          packages = mkShellApps {
            runElibrary = {
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib
                ]}
                poetry run uvicorn --port ${portElibrary} --host 0.0.0.0 elibrary.main:app --reload
              '';
            };
            prod-build-pdfjs = {
              runtimeInputs = [ pkgs.nodePackages.gulp ];
              text =
                let dist = "front/public/pdfjs"; in
                ''cp -r ${pdfjs.outPath}/build/generic/* ${dist}'';
              description = ''build pdfjs for front'';
            };
            prod-build-react = {
              runtimeInputs = [ pkgs.nodejs ];
              text =
                let dist = "elibrary/static/front"; in
                ''
                  (cd front && npm run build)
                  mkdir -p ${dist}
                  cp -r front/dist/* ${dist}
                '';
              description = ''prod build of front without pdfjs build'';
            };
            prod-build-front = {
              text =
                ''
                  ${getExe packages.prod-build-pdfjs}
                  ${getExe packages.prod-build-react}
                '';
              description = ''prod build of front'';
            };

            import-catalog = {
              runtimeInputs = [ pkgs.poetry pkgs.sqlite ];
              text = ''
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc.lib
                ]}
                poetry run import-catalog
              '';
              description = ''import books catalog into database + save sql'';
            };

            extract-covers = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''poetry run extract-covers -p ${pkgs.poppler_utils}/bin -f 1 -l 1 -i books -o covers'';
              description = ''extract book cover images'';
            };

            prod = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                ${getExe packages.prod-build-front}
                ${getExe packages.stop}
                ${getExe packages.runElibrary}
              '';
              description = ''run prod site at localhost:${portElibrary}'';
            };
            prod-elibrary = {
              runtimeInputs = [ pkgs.poetry ];
              text = ''
                ${getExe packages.stop}
                ${getExe packages.runElibrary} &
              '';
              description = ''run prod server at localhost:${portElibrary}'';
            };
            dev = {
              runtimeInputs = [ pkgs.poetry pkgs.nodejs ];
              text = ''
                ${getExe packages.stop}
                ${getExe packages.runElibrary} &
                (cd front && npm run dev)
              '';
              description = "run dev site at localhost:${portFront}";
            };
            release = {
              runtimeInputs = [ pkgs.nodePackages.localtunnel ];
              text = ''
                ${getExe packages.stop}
                ${getExe packages.prod} &
                lt -s 'elibrary-itpd' -p ${portElibrary} &
              '';
              description = ''run and expose site via localtunnel'';
            };
            release-ngrok = {
              runtimeInputs = [ pkgs.sops pkgs.ngrok ];
              text = ''
                ${getExe packages.stop}
                sops -d elibrary/enc.auth.env > elibrary/auth.env
                ${getExe packages.prod} &
                ngrok http --domain recently-wanted-elf.ngrok-free.app ${portElibrary} &
              '';
              description = ''run and expose site via ngrok'';
            };

            stop = {
              runtimeInputs = [ pkgs.lsof ];
              text = ''
                kill -9 $(lsof -t -i:${portElibrary}) || true
                kill -9 $(lsof -t -i:${portFront}) || true
              '';
              description = ''stop dev servers'';
            };

            install = {
              runtimeInputs = [ pkgs.poetry pkgs.nodejs ];
              text = ''
                poetry install
                (cd front && npm i)
              '';
              description = ''install dependencies'';
            };

            packageBack =
              let
                poetry2nix = (pkgs.appendOverlays [ inputs.poetry2nix.overlays.default ]).poetry2nix;
                p2nix = poetry2nix.overrideScope' (self: super: {
                  defaultPoetryOverrides = super.defaultPoetryOverrides.extend (pyself: pysuper: {
                    baize = pysuper.baize.overridePythonAttrs
                      (
                        old: {
                          buildInputs = (old.buildInputs or [ ]) ++ [ pysuper.pdm-pep517 pysuper.setuptools ];
                        }
                      );
                    pandas = pysuper.pandas.overridePythonAttrs
                      (
                        old: {
                          buildInputs = (old.buildInputs or [ ]) ++ [ pysuper.meson-python ];
                        }
                      );
                  });
                });
                app = p2nix.mkPoetryEnv {
                  projectDir = ./.;
                  groups = [ "prod" ];
                  editablePackageSources = {
                    elibrary = ./elibrary;
                    import-catalog = ./import-catalog;
                    extract-covers = ./extract-covers;
                  };
                };
              in
              app;

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

              npmDepsHash = "sha256-OUAjjv0xZjvh+M8xiH4MYNzF4Sa0ZwokBikseMnWE3M=";
            };

            packageServer =
              let
                source = inputs.nix-filter {
                  root = ./.;
                  include = [
                    "elibrary"
                    "import-catalog"
                    "poetry.lock"
                    "poetry.toml"
                    "pyproject.toml"
                  ];
                };
              in
              pkgs.stdenv.mkDerivation {
                pname = "project";
                version = "0.0.1";
                phases = [ "installPhase" ];
                installPhase = ''
                  APP=$out/elibrary
                  mkdir -p $APP

                  VENV=$APP/.venv
                  mkdir $VENV

                  cp -r ${source}/* $APP
                  chmod -R +w $APP
                  cp -r ${packages.packageBack}/* $VENV

                  FRONT=$APP/elibrary/static/front
                  mkdir -p $FRONT

                  cp -r ${packages.packageFront}/* $FRONT
                '';
              };

            # data should be mounted externally
            # see compose.yaml
            imageServer = pkgs.dockerTools.streamLayeredImage {
              name = "elibrary";
              tag = "latest";
              contents = [
                packages.packageServer
                pkgs.bashInteractive
                pkgs.coreutils
                pkgs.poetry
              ];

              config = {
                Entrypoint = [ "bash" "-c" ];
                Cmd = [
                  ''
                    cd elibrary
                    chmod +x .venv/bin/{python,uvicorn}
                    ${getExe packages.runElibrary}
                  ''
                ];
              };
            };

            dockerLoadImageServer = {
              runtimeInputs = [ pkgs.docker ];
              text = ''${packages.imageServer} | docker load'';
            };
          };
          devShells.default = mkShell {
            commands = (map (x: { package = x; }) [
              pkgs.curl
              pkgs.sqlite
              pkgs.poetry
              pkgs.nodejs
              pkgs.nodePackages.localtunnel
              pkgs.rnix-lsp
              pkgs.nixpkgs-fmt
              pkgs.openssl
              pkgs.gnupg
              pkgs.sops
              pkgs.ngrok
              pkgs.graphviz
              pkgs.jdk11
              pkgs.plantuml
              pkgs.docker
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
