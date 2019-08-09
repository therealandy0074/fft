import { CookieStorage } from './cookie-storage';
export declare class CookieFileStorage extends CookieStorage {
    constructor(cookiePath: any);
    destroy(): void;
    static ensureExistenceOfJSONFilePath(path: any): void;
}
