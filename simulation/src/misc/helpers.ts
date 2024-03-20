export const getRandomId = (): string => Math.random().toString(36).slice(2);
export const getRandomElement = <TYPE>(array: TYPE[]): TYPE => {
    if (array.length === 0) {
        throw Error("Can't get random element because array has a length of 0!")
    }
    return array[Math.floor(Math.random()*array.length)];
}
export const getRandomIntFromInterval = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);
