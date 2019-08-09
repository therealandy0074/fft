import { Media } from '../models/media';
import { Session } from '../core';
import { AbstractFeed } from './abstract.feed';
export declare class UserMediaFeed extends AbstractFeed<Media> {
    accountId: string | number;
    limit: number;
    constructor(session: Session, accountId: string | number, limit?: number);
    get(): Promise<Media[]>;
}
