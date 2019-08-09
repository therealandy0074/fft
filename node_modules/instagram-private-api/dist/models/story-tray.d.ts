import { User } from './user';
import { Media } from './media';
import { Location } from './location';
import { AbstractModel } from './abstract.model';
export declare class StoryTray extends AbstractModel {
    id: number;
    latest_reel_media: number;
    expiring_at: number;
    seen: number;
    can_reply: boolean;
    can_reshare: boolean;
    reel_type: string;
    user: User;
    ranked_position: number;
    seen_ranked_position: number;
    muted: boolean;
    prefetch_count: number;
    has_besties_media: boolean;
    media_count: number;
    unique_integer_reel_id: string | number;
    location: Location;
    items: Media[];
}
