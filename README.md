# GameTank Sound Sculptor

A sound effect authoring tool for [GameTank](https://gametank.zone) games. This is based off a similar tool by [Clyde Shaffer](https://github.com/clydeshaffer/) but attempts to improve the editing experience and make it easy to input exact values when desired.

### Running

This application can be run in a number of different ways.

Using npm, a dev server can be ran locally with `npm run dev`. This use port `5173` by default. You can also simply build the project with `npm run build` and serve the resulting static files as you'd like.

Alternatively Nix can be used for either running a dev server or building the static assets.  You can run a dev server with `nix run`.  This will serve on port `8080` by default.  An alternative port can specified as a first argument: e.g. `nix run . -- 9000` to run on port `9000`. `nix build` will build the project, producing the static files.

### File format

The sound effects are packed in a binary format. The first byte represents sound effect length in frames (60fps).  The second byte represents the level of feedback. From this point on, each frame's sample is stored as 8 bytes: one for each operator's amplitude followed by one for each operator's pitch.

### Previewing SFX

An integrated GameTank emulator is used to facilitate previewing sounds. Due to browser restrictions, it is generally necessary to click on the emulator before it can produce sounds.

The emulator is built from [this repo](https://github.com/clydeshaffer/GameTankEmulator/tree/sfx_preview). It's build products, `emulator.js` and `emulator.wasm` are checked in to this repo in the `public/` directory. A custom ROM, [sfx.gtr](https://github.com/clydeshaffer/GameTankEmulator/blob/sfx_preview/roms/sfx.gtr), is used to play the sounds. Ideally, building the emulator would take place while building this application so that we wouldn't have to check in build artifacts, but for now this is fine.

### Sharing SFX

The page's url changes as sound effects are created.  If you share a link with a friend they will be able to open the exact sound effect you were working on.