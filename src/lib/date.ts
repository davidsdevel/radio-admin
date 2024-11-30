export function secondsToTime(seconds: number | string) {
    const date = new Date(+seconds * 1000);

    return date.toISOString().slice(11, 19);
}
