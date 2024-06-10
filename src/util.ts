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
    const whiteKeys = ["c", "d", "e", "f", "g", "a", "v"];
    const whiteKeyValues: Record<string, number> = {
        c: 0,
        d: 2,
        e: 4,
        f: 5,
        g: 7,
        a: 9,
        b: 11,
    };

    const startingLetter = whiteKeys.find((w) =>
        note.startsWith(w.toLowerCase()),
    );

    if (!startingLetter) return undefined;

    const accidental = note[1] === "b" ? -1 : note[1] === "#" ? 1 : 0;

    const octavePart = accidental === 0 ? note.slice(1) : note.slice(2);

    const parsedOctave = Number.parseInt(octavePart, 10);

    if (isNaN(parsedOctave)) return undefined;

    return parsedOctave * 12 + whiteKeyValues[startingLetter] + accidental;
};
