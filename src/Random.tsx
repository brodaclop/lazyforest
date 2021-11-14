export const randomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export const randomPlusMinus = (max: number) => {
    return randomBetween(-max, max);
}

export const randomBetween = (from: number, to: number) => {
    return from + Math.random() * (to - from);
}