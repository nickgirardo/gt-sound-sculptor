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

export const noteToMidi = (note: string): number | undefined => {
    const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
    const whiteKeyValues: Record<string, number> = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11,
    };

    const startingLetter = whiteKeys.find((w) => note.startsWith(w));

    if (!startingLetter) return undefined;

    const accidental = note[1] === "b" ? -1 : note[1] === "#" ? 1 : 0;

    const octavePart = accidental === 0 ? note.slice(1) : note.slice(2);

    const parsedOctave = Number.parseInt(octavePart, 10);

    if (isNaN(parsedOctave)) return undefined;

    return parsedOctave * 12 + whiteKeyValues[startingLetter] + accidental;
};
