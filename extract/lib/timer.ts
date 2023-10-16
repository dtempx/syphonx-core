export class Timer {
    t0: number;
    constructor() {
        this.t0 = Date.now();
    }
    elapsed(): number {
        return Date.now() - this.t0;
    }
}
