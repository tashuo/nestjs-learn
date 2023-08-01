export enum NoticeTypes {
    FOLLOW = 'follow',
    LIKE = 'like',
    COLLECT = 'collect',
    COMMENT = 'comment',
}

export interface NoticeSummary {
    type: string;
    count: number;
}
