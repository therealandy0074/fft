import { AbstractFeed } from './abstract.feed';
import { User } from '../models/user';
export declare class StoryViewersFeed extends AbstractFeed<User> {
    mediaId: any;
    constructor(session: any, mediaId: any);
    get(): Promise<User[]>;
}
