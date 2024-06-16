import { EncodingStrategy } from "./encode";

const magicString = "GTSS";
const bytesForVersion = 2;

type AppData = {
    sfxLength: number;
    feedback: number;
    op1Amps: Array<number>;
    op1Pitches: Array<number>;
    op2Amps: Array<number>;
    op2Pitches: Array<number>;
    op3Amps: Array<number>;
    op3Pitches: Array<number>;
    op4Amps: Array<number>;
    op4Pitches: Array<number>;
};

// Simple wrapper to have atob return null instead of throwing
const _atob = (param: string): string | null => {
    try {
        return atob(param);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export class BitReader {
    raw: Uint8Array;
    readIndex: number = 0;

    constructor(raw: Uint8Array) {
        this.raw = raw;
    }

    reset() {
        this.readIndex = 0;
    }

    getBitsRemaining(): number {
        return this.raw.length * 8 - this.readIndex;
    }
    hasBitsRemaining(count: number): boolean {
        const endingIndex = this.readIndex + count;
        return endingIndex <= this.raw.length * 8;
    }

    getBits(count: number): number {
        // Make sure we don't read beyond the array bounds
        const endingIndex = this.readIndex + count;
        if (endingIndex > this.raw.length * 8) {
            throw new Error("read to far");
        }

        let bitsRemaining = count;
        let result = 0;
        while (bitsRemaining > 0) {
            const currentByte = Math.floor(this.readIndex / 8);
            // How many bits can be read from the current byte?
            const bitsAvailable = 8 - (this.readIndex % 8);

            if (bitsRemaining <= bitsAvailable) {
                const diff = bitsAvailable - bitsRemaining;
                const mask = 2 ** bitsAvailable - 1;
                const data = (this.raw[currentByte] & mask) >>> diff;

                result = (result << bitsRemaining) + data;
                break;
            } else {
                // bitsRemaining > bitsAvailable
                const mask = 2 ** bitsAvailable - 1;
                const data = this.raw[currentByte] & mask;
                result = (result << bitsAvailable) + data;

                this.readIndex += bitsAvailable;
                bitsRemaining -= bitsAvailable;
            }
        }

        this.readIndex = endingIndex;
        return result;
    }
}

const decodeV0 = (param: string): AppData | null => {
    const decodeStrategy = (reader: BitReader): EncodingStrategy =>
        reader.getBits(2) as EncodingStrategy;

    const decodeChannel = (
        reader: BitReader,
        frameCount: number,
        bitsPerEntry: number,
    ): Array<number> => {
        const strat = decodeStrategy(reader);

        switch (strat) {
            case EncodingStrategy.Constant:
                return new Array(frameCount).fill(reader.getBits(bitsPerEntry));
            case EncodingStrategy.FullySpecified: {
                const ret = [];
                for (let i = 0; i < frameCount; i++) {
                    ret.push(reader.getBits(bitsPerEntry));
                }
                return ret;
            }
            case EncodingStrategy.RLE: {
                const bitsPerIndex = Math.ceil(Math.log2(frameCount));
                const ret = [];
                let framesRead = 0;

                while (framesRead < frameCount) {
                    const newFrames = reader.getBits(bitsPerIndex);
                    const value = reader.getBits(bitsPerEntry);

                    for (let i = 0; i < newFrames; i++) {
                        ret.push(value);
                    }
                    framesRead += newFrames;
                }

                return ret;
            }
            default:
                throw new Error("Unexpected EncodingStrategy");
        }
    };
    const bitsPerAmp = 4;
    const bitsPerPitch = 7;

    const raw = new Uint8Array(param.length);
    for (let i = 0; i < param.length; i++) {
        raw[i] = param.charCodeAt(i);
    }
    const reader = new BitReader(raw);

    const frameCount = reader.getBits(8);

    if (frameCount === 0) {
        console.error("Frame Count must not be 0");
        return null;
    }

    const feedback = reader.getBits(8);

    const op1Amps = decodeChannel(reader, frameCount, bitsPerAmp);
    const op1Pitches = decodeChannel(reader, frameCount, bitsPerPitch);
    const op2Amps = decodeChannel(reader, frameCount, bitsPerAmp);
    const op2Pitches = decodeChannel(reader, frameCount, bitsPerPitch);
    const op3Amps = decodeChannel(reader, frameCount, bitsPerAmp);
    const op3Pitches = decodeChannel(reader, frameCount, bitsPerPitch);
    const op4Amps = decodeChannel(reader, frameCount, bitsPerAmp);
    const op4Pitches = decodeChannel(reader, frameCount, bitsPerPitch);

    return {
        sfxLength: frameCount,
        feedback,
        op1Amps,
        op1Pitches,
        op2Amps,
        op2Pitches,
        op3Amps,
        op3Pitches,
        op4Amps,
        op4Pitches,
    };
};

const decoders = new Map([["v0", decodeV0]]);

export const decodeSFX = (param: string): AppData | null => {
    // Make sure to undo all of the url safe transformations
    const byteString = _atob(
        param.replaceAll("-", "+").replaceAll("_", "/").replaceAll("*", "="),
    );

    if (!byteString) return null;

    if (!byteString.startsWith(magicString)) {
        console.error(`Expected magic string "${magicString}"`);
        return null;
    }

    const version = byteString.slice(
        magicString.length,
        magicString.length + bytesForVersion,
    );

    if (!decoders.has(version)) {
        console.error(`Unknown version "${version}"`);
        return null;
    }

    return decoders.get(version)!(
        byteString.slice(magicString.length + bytesForVersion),
    );
};
