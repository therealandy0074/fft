import * as Bluebird from 'bluebird';
import { Store, Cookie } from 'tough-cookie';
export declare class CookieStorage {
    storage: Store;
    constructor(storage: Store);
    readonly store: Store;
    getCookieValue(name: any): Bluebird<Cookie>;
    putCookie(cookie: any): Bluebird<{}>;
    getCookies(): Bluebird<{}>;
    getAccountId(): Bluebird<number>;
    getSessionId(): Bluebird<string>;
    removeCheckpointStep(): Bluebird<{}>;
    destroy(): void;
}
