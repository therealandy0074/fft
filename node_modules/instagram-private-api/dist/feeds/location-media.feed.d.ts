import { AbstractFeed } from './abstract.feed';
import { Media } from '../models/media';
export declare class LocationMediaFeed extends AbstractFeed<Media> {
    locationId: string | number;
    limit: number;
    constructor(session: any, locationId: string | number, limit?: number);
    get(): Promise<Media[]>;
}
