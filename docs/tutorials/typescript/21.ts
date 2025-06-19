class Logger {
    log(message: string) {
        console.log(message);
    }
}

class LoggedActivatable extends Activatable implements Logger {
    // Logger
    log: (message: string) => void;

    // Override activate and deactivate
    activate() {
        super.activate();
        this.log("Activating...");
    }
    deactivate() {
        super.deactivate();
        this.log("Deactivating...");
    }
}

applyMixins(LoggedActivatable, [Logger]);