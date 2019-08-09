import * as Bluebird from 'bluebird';
import { User } from '../models/user';
import { Session } from '../core';
export declare class Account {
    static getById(session: Session, id: string | number): Promise<User>;
    static search(session: Session, username: string): Promise<User[]>;
    static searchForUser(session: Session, username: string): Promise<User>;
    static setProfilePicture(session: Session, streamOrPath: any): Promise<User>;
    static setPrivacy(session: Session, pri: boolean | number | string): Promise<User>;
    static editProfile(session: Session, settings: any): Bluebird<User>;
    static showProfile(session: Session): Promise<User>;
}
