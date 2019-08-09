import { Media } from '../models/media';
import { AbstractFeed } from './abstract.feed';
interface TimelineFeedGetProps {
    is_pull_to_refresh?: boolean | null;
}
export declare class TimelineFeed extends AbstractFeed<Media> {
    limit: number;
    constructor(session: any, limit?: number);
    get({ is_pull_to_refresh }: TimelineFeedGetProps): Promise<Media[]>;
}
export {};
