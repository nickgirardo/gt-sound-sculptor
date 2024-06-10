export const range = (n: number): Array<number> => [...new Array(n).keys()];

export const midiToNote = (m: number): string => {
    const noteNames = [
        "C",
        "C#",
        "D",
        "Eb",
        "E",
        "F",
        "F#",
        "G",
        "Ab",
        "A",
        "Bb",
        "B",
    ];
    const noteInOctave = noteNames[m % 12];
    const octave = Math.floor(m / 12);

    return noteInOctave + octave;
};
