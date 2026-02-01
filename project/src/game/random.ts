export function createSeededRandom(seed: number): () => number {
    // random() gives 0 to 1
    return function () {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

export function getTodaysSeed(): number {
    const today = new Date();
    return today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate();
}

export function getRandomInt(random: () => number, min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
}