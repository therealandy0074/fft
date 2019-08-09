import { AbstractFeed } from './abstract.feed';
import { Media } from '../models/media';
export declare class SelfLikedFeed extends AbstractFeed<Media> {
    limit: any;
    constructor(session: any, limit: any);
    get(): Promise<Media[]>;
}
