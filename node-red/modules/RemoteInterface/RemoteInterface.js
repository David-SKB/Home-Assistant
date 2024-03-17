class RemoteInterface {
  constructor(remoteConfig = {}) {
      this.remotes = remoteConfig.remotes || {};
  }

  setRemote(remoteId, sourceRemote = null) {
      if (sourceRemote instanceof Remote) {
          this.remotes[remoteId] = sourceRemote.getObject();
      } else if (sourceRemote) {
          if (!validateRemote(sourceRemote)) {
              throw new Error('Invalid remote configuration');
          }
          this.remotes[remoteId] = sourceRemote;
      } else {
          this.remotes[remoteId] = {
              buttons: {}
          };
      }
      return new Remote(remoteId, []);
  }

  setButton(remoteId, buttonId, sourceButton = null) {
      if (!this.remotes[remoteId]) {
          this.createRemote(remoteId);
      }
      if (sourceButton) {
          if (!validateButton(sourceButton)) {
              throw new Error('Invalid button configuration');
          }
          this.remotes[remoteId].buttons[buttonId] = sourceButton;
      } else {
          this.remotes[remoteId].buttons[buttonId] = {
              commands: {}
          };
      }
      return new Button(remoteId, buttonId);
  }

  setCommand(remoteId, buttonId, commandId, sourceCommand = null) {
      if (!this.remotes[remoteId]) {
          this.createRemote(remoteId);
      }
      if (!this.remotes[remoteId].buttons[buttonId]) {
          this.createButton(remoteId, buttonId);
      }
      if (sourceCommand) {
          if (!validateCommand(sourceCommand)) {
              throw new Error('Invalid command configuration');
          }
          this.remotes[remoteId].buttons[buttonId].commands[commandId] = sourceCommand;
      } else {
          this.remotes[remoteId].buttons[buttonId].commands[commandId] = {
              action: {}
          };
      }
      return new Command(buttonId, commandId);
  }

  getRemoteIds() {
      return Object.keys(this.remotes);
  }

  getButtonIds(remoteId) {
      if (this.remotes[remoteId]) {
          return Object.keys(this.remotes[remoteId].buttons);
      }
      return [];
  }

  getCommandIds(remoteId, buttonId) {
      if (this.remotes[remoteId] && this.remotes[remoteId].buttons[buttonId]) {
          return Object.keys(this.remotes[remoteId].buttons[buttonId].commands);
      }
      return [];
  }

  getObject() {
      return {
          remotes: this.remotes
      };
  }

  // Validation functions
  validateRemote(remoteConfig) {
    if (typeof remoteConfig !== 'object' || remoteConfig === null) {
        return false;
    }
    if (!remoteConfig.hasOwnProperty('buttons') || typeof remoteConfig.buttons !== 'object' || remoteConfig.buttons === null) {
        return false;
    }
    for (const buttonId in remoteConfig.buttons) {
        if (!remoteConfig.buttons.hasOwnProperty(buttonId)) {
            continue;
        }
        const buttonConfig = remoteConfig.buttons[buttonId];
        if (typeof buttonConfig !== 'object' || buttonConfig === null) {
            return false;
        }
        if (!buttonConfig.hasOwnProperty('commands') || typeof buttonConfig.commands !== 'object' || buttonConfig.commands === null) {
            return false;
        }
    }
    return true;
  }

  validateButton(buttonConfig) {
    if (typeof buttonConfig !== 'object' || buttonConfig === null) {
        return false;
    }
    if (!buttonConfig.hasOwnProperty('commands') || typeof buttonConfig.commands !== 'object' || buttonConfig.commands === null) {
        return false;
    }
    return true;
  }

  validateCommand(commandConfig) {
    if (typeof commandConfig !== 'object' || commandConfig === null) {
        return false;
    }
    // Add any specific validation logic for command configuration
    return true;
  }
}