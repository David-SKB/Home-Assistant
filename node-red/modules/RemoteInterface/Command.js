class Command {
    constructor(commandId, action = {}) {
        this.commandId = commandId;
        this.action = action;
    }

    getId() {
        return this.commandId;
    }

    getObject() {
        return this.action;
    }
}
