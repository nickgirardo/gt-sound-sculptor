const magicString = "GTSS";
const encoderVersion = "v0";

export class BitWriter {
    arr: Array<number> = [];
    writeBit: number = 0;

    writeBits(bitsRemaining: number, value: number) {
        if (bitsRemaining > 8) {
            throw new RangeError(
                `For now, the number of bits must be at most 8.  You gave ${bitsRemaining}.`,
            );
        }

        if (2 ** bitsRemaining <= value) {
            throw new RangeError(`The given value is too large.
It must be between 0 and 2^${bitsRemaining} (the first argument) - 1.
In this case, that is 0..${2 ** bitsRemaining - 1}.  You gave ${value}.`);
        }

        if (this.writeBit === 0) this.arr.push(0);

        const bitsAvailable = 8 - this.writeBit;

        if (bitsRemaining <= bitsAvailable) {
            const diff = bitsAvailable - bitsRemaining;
            const shifted = value << diff;
            this.arr[this.arr.length - 1] += shifted;
            this.writeBit = (this.writeBit + bitsRemaining) % 8;
            return;
        }

        // bitsRemaining > bitsAvailable
        const diff = bitsRemaining - bitsAvailable;

        const mask = 2 ** diff - 1;
        const remainder = value & mask;

        const shifted = value >>> diff;
        this.arr[this.arr.length - 1] += shifted;
        this.writeBit = 0;
        this.writeBits(diff, remainder);
    }
}

export enum EncodingStrategy {
    FullySpecified = 0,
    RLE = 1,
    Constant = 2,
}

export const encodeSFX = (
    sfxLength: number,
    feedback: number,
    op1Amps: Array<number>,
    op1Pitches: Array<number>,
    op2Amps: Array<number>,
    op2Pitches: Array<number>,
    op3Amps: Array<number>,
    op3Pitches: Array<number>,
    op4Amps: Array<number>,
    op4Pitches: Array<number>,
): string => {
    const calcRLE = (data: Array<number>): Array<[number, number]> => {
        let ret: Array<[number, number]> = [];

        let runningCount = 0;
        let current = data[0];

        for (const d of data) {
            if (d === current) {
                runningCount++;
            } else {
                ret.push([runningCount, current]);
                runningCount = 1;
                current = d;
            }
        }

        ret.push([runningCount, current]);
        return ret;
    };

    const encodeStrategy = (
        writer: BitWriter,
        strat: EncodingStrategy,
    ): void => {
        writer.writeBits(2, strat);
    };

    const encodeData = (
        writer: BitWriter,
        data: Array<number>,
        bitsPerEntry: number,
    ): void => {
        // Is every entry the same?
        if (data.every((d) => d === data[0])) {
            encodeStrategy(writer, EncodingStrategy.Constant);
            writer.writeBits(bitsPerEntry, data[0]);
            return;
        }

        const bitsPerIndex = Math.ceil(Math.log2(data.length));

        const fullySpecifiedCost = data.length * bitsPerEntry;

        const rleRequiredChagnes = data.reduce(
            ([currentLetter, requiredChanges], b) =>
                b === currentLetter
                    ? [currentLetter, requiredChanges]
                    : [b, requiredChanges + 1],
            [data[0], 1],
        )[1];
        const rleCost = (bitsPerEntry + bitsPerIndex) * rleRequiredChagnes;

        if (rleCost < fullySpecifiedCost) {
            const rle = calcRLE(data);
            encodeStrategy(writer, EncodingStrategy.RLE);

            for (const [count, val] of rle) {
                writer.writeBits(bitsPerIndex, count);
                writer.writeBits(bitsPerEntry, val);
            }
        } else {
            encodeStrategy(writer, EncodingStrategy.FullySpecified);
            for (const d of data) {
                writer.writeBits(bitsPerEntry, d);
            }
        }
    };

    let str = `${magicString}${encoderVersion}${String.fromCharCode(sfxLength)}${String.fromCharCode(feedback)}`;

    const writer = new BitWriter();

    const bitsPerAmp = 4;
    const bitsPerPitch = 7;

    encodeData(writer, op1Amps, bitsPerAmp);
    encodeData(writer, op1Pitches, bitsPerPitch);
    encodeData(writer, op2Amps, bitsPerAmp);
    encodeData(writer, op2Pitches, bitsPerPitch);
    encodeData(writer, op3Amps, bitsPerAmp);
    encodeData(writer, op3Pitches, bitsPerPitch);
    encodeData(writer, op4Amps, bitsPerAmp);
    encodeData(writer, op4Pitches, bitsPerPitch);

    for (const w of writer.arr) {
        str += String.fromCharCode(w);
    }

    const urlUnsafe = btoa(str);

    return urlUnsafe
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "*");
};
