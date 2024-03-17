class Remote {
    constructor(remoteId, buttons = []) {
        this.remoteId = remoteId;
        this.buttons = buttons;
    }

    addButton(buttonId, sourceButton = null) {
        const button = new Button(buttonId);
        if (sourceButton) {
            sourceButton.commands.forEach(sourceCommand => {
                button.addCommand(sourceCommand.commandId, sourceCommand);
            });
        }
        this.buttons.push(button);
        return button;
    }

    getId() {
        return this.remoteId;
    }

    getObject() {
        const remoteObject = {};
        this.buttons.forEach(button => {
            remoteObject[button.getId()] = button.getObject();
        });
        return remoteObject;
    }
}