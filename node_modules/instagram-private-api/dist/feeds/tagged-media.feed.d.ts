import { AbstractFeed } from './abstract.feed';
import { Media } from '../models/media';
export declare class TaggedMediaFeed extends AbstractFeed<Media> {
    tag: string;
    limit: number;
    constructor(session: any, tag: string, limit?: number);
    getRawResponse(): Promise<any>;
    get(): Promise<Media[]>;
    getRankedItems(): Promise<Media[]>;
}
