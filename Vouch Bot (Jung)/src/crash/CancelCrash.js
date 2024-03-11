const fs = require("fs");

class CancelCrash {

    constructor() {
        this.crashdumps = './crashdumps';
        if (!fs.existsSync(this.crashdumps)) {
            fs.mkdirSync(this.crashdumps);
        }
        const errors = [
            'uncaughtException',
            'unhandledRejection',
            'DiscordAPIError',
            'error'
            ];
        for (const error of errors) {
            process.on(error, (err) => {
                this.writeCrashDump(err);
            });
        }
    }

    async writeCrashDump(err) {
        let dump = {
            time: new Date().getTime(),
            stack: err.stack,
            message: err.message
        }
        const date = new Date().toISOString().replace(/:/g, '-');
        console.log(`Writing crash dump to ${this.crashdumps}/${date}.json`);
        fs.writeFileSync(`${this.crashdumps}/${date}.json`, JSON.stringify(dump, null, 4));
    }
}

module.exports = {
    CancelCrash
}