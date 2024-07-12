{
  description = "GT Sound Sculptor";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.11";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, gitignore }:
    let
      allSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs allSystems (system: f {
        inherit system;
        pkgs = import nixpkgs { inherit system; };
      });
    in rec {
      packages = forAllSystems ({ pkgs, ... }: rec {
        default = gt-sound-sculptor;
        gt-sound-sculptor = pkgs.buildNpmPackage {
          name = "gt-sound-sculptor";
          src = gitignore.lib.gitignoreSource ./.;
          npmDepsHash = "sha256-ZHF5JUQV3iEiJpjaYWSjzAYhQlYv9g+/SExgdBL+PvQ=";
          installPhase = ''
            mkdir -p $out/dist
            cp -r dist/ $out/
          '';
        };
      });
      apps = forAllSystems ({ pkgs, system, ... }:
        let
        serv = pkgs.writeShellApplication {
          name = "serve";
          runtimeInputs = [ pkgs.caddy ];
          text = ''
            # Takes port as first argument, defaulting to 8080
            PORT="''${1:-8080}"
            caddy file-server --listen :"$PORT" --root ${packages.${system}.gt-sound-sculptor.outPath}/dist
          '';
        };
        in rec {
            serve = {
              type = "app";
              program = "${serv}/bin/serve";
            };
            default = serve;
          }
      );
    };
}
