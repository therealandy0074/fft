import { AbstractFeed } from './abstract.feed';
import { Session } from '../core';
import { Comment } from '../models/comment';
export declare class MediaCommentsFeed extends AbstractFeed<Comment> {
    mediaId: any;
    cursorType: string;
    constructor(session: Session, mediaId: any);
    setCursor(cursor: any): void;
    get(): Promise<Comment[]>;
}
