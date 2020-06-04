export class LoginInfo {
    username: string;
    password: string;
    deviceInfo: string;
    ipAddress?: string;

    constructor(username: string, password: string, deviceInfo: string, ipAddress?: string) {
        this.username = username;
        this.password = password;
        this.deviceInfo = deviceInfo;
        if ( ipAddress ) {
            this.ipAddress = ipAddress;
        }
    }
}
