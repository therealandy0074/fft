import { Session } from '../core';
import { Media } from '../models/media';
export declare class UserStoryFeed {
    session: Session;
    userIds: (string | number)[];
    constructor(session: Session, userIds: (string | number)[]);
    get(): Promise<Media[]>;
}
