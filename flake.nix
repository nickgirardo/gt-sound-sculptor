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
    in {
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
    };
}
