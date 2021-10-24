export const randomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export const randomPlusMinus = (max: number) => {
    return randomInt(2 * max + 1) - max;
}

export const randomBetween = (from: number, to: number) => {
    return from + Math.random() * (to - from);
}