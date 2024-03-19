class DeviceManager {
    constructor(mapping = {}) {
        this.devices = mapping;
    }

    setDevice(device_id, remote_id) {
        this.devices[device_id] = remote_id;
    }

    getDevice(device_id) {
        return this.devices[device_id];
    }

    removeDevice(device_id) {
        if (this.devices.hasOwnProperty(device_id)) {
            delete this.devices[device_id];
        }
    }

    getDevices() {
        return this.devices;
    }
}