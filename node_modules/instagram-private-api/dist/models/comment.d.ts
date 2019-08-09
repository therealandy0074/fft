import { User } from './user';
import { AbstractModel } from './abstract.model';
export declare class Comment extends AbstractModel {
    pk: number | string;
    user_id: number;
    text: string;
    type: number;
    created_at: number;
    created_at_utc: number;
    content_type: string;
    status: string;
    bit_flags: number;
    user: User;
    did_report_as_spam: boolean;
    share_enabled: boolean;
    media_id: number | string;
    has_translation: boolean;
    has_liked_comment: boolean;
    comment_like_count: number;
    readonly account: User;
}
