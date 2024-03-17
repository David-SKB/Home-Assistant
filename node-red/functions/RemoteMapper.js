class Remote {
    constructor(remoteManager, remoteId) {
      this.remoteManager = remoteManager;
      this.remoteId = remoteId;
    }
  
    addButton(buttonId, sourceButton = null) {
      return this.remoteManager.setButton(this.remoteId, buttonId, sourceButton);
    }
  
    addCommand(buttonId, commandId, sourceCommand = null) {
      return this.remoteManager.setCommand(this.remoteId, buttonId, commandId, sourceCommand);
    }
  
    getId() {
      return this.remoteId;
    }
  }
  
  class Button {
    constructor(remoteManager, remoteId, buttonId) {
      this.remoteManager = remoteManager;
      this.remoteId = remoteId;
      this.buttonId = buttonId;
    }
  
    addCommand(commandId, sourceCommand = null) {
      return this.remoteManager.setCommand(this.remoteId, this.buttonId, commandId, sourceCommand);
    }
  
    getId() {
      return this.buttonId;
    }
  }
  
  class Command {
    constructor(remoteManager, remoteId, buttonId, commandId) {
      this.remoteManager = remoteManager;
      this.remoteId = remoteId;
      this.buttonId = buttonId;
      this.commandId = commandId;
    }
  
    getId() {
      return this.commandId;
    }
  }
  
  class RemoteManager {
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
      return new Remote(this, remoteId);
    }
  
    setButton(remoteId, buttonId, sourceButton = null) {
      if (!this.remotes[remoteId]) {
        this.setRemote(remoteId);
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
      return new Button(this, remoteId, buttonId);
    }
  
    setCommand(remoteId, buttonId, commandId, sourceCommand = null) {
      if (!this.remotes[remoteId]) {
        this.setRemote(remoteId);
      }
      if (!this.remotes[remoteId].buttons[buttonId]) {
        this.setButton(remoteId, buttonId);
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
      return new Command(this, remoteId, buttonId, commandId);
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
  }
  
  // Validation functions
  function validateRemote(remoteConfig) {
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
  
  function validateButton(buttonConfig) {
    if (typeof buttonConfig !== 'object' || buttonConfig === null) {
      return false;
    }
    if (!buttonConfig.hasOwnProperty('commands') || typeof buttonConfig.commands !== 'object' || buttonConfig.commands === null) {
      return false;
    }
    return true;
  }
  
  function validateCommand(commandConfig) {
    if (typeof commandConfig !== 'object' || commandConfig === null) {
      return false;
    }
    // Add any specific validation logic for command configuration
    return true;
  }
  
  module.exports = {
    Remote,
    Button,
    Command,
    RemoteManager
  };
  