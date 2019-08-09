import { StoryTray } from '../models/story-tray';
export declare class StoryTrayFeed {
    private session;
    constructor(session: any);
    get(): Promise<StoryTray[]>;
}
