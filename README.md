# GameTank Sound Sculptor

A sound effect authoring tool for [GameTank](https://gametank.zone) games. This is based off a similar tool by [Clyde Shaffer](https://github.com/clydeshaffer/) but attempts to improve the editing experience and make it easy to input exact values when desired.

### Running

A dev server can be ran locally with `npm run dev`. This use port `5173` by default.

Alternatively, static files can be produced with `npm run build` and served as you'd like.

### File format

The sound effects are packed in a binary format. The first byte represents sound effect length in frames (60fps).  The second byte represents the level of feedback. From this point on, each frame's sample is stored as 8 bytes: one for each operator's amplitude followed by one for each operator's pitch.

### Future work

There are a number of minor usability improvements I'd like to make but the most impactful feature yet implemented is the ability to preview sound effects. Lacking this makes testing sound effects difficult and especially inhibits experimentation. It should be possible to feature a (possibly stripped down) GameTank emulator within this tool play roms which just play the sound effect and exit. If this is too heavy perhaps a very simplified emulator that just handles sound could be built.

Currently it is not possible to import a previously exported sound effect. This would make it possible to touch up previously made sound effects. Currently if this feature is required, Clyde's sfx tool can be used.
