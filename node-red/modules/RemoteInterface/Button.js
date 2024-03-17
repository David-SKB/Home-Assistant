class Button {
    constructor(buttonId, commands = []) {
        this.buttonId = buttonId;
        this.commands = commands;
    }

    addCommand(commandId, sourceCommand = null) {
        const command = new Command(commandId);
        if (sourceCommand) {
            // Copy properties from source command to new command
            command.action = { ...sourceCommand.action };
        }
        this.commands.push(command);
        return command;
    }

    getId() {
        return this.buttonId;
    }

    getObject() {
        const buttonObject = {};
        this.commands.forEach(command => {
            buttonObject[command.getId()] = command.getObject();
        });
        return buttonObject;
    }
}