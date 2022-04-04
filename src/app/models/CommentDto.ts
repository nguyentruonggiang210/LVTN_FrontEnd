export interface CommentDto {
    commentId: number,
    commentContent: string,
    createDate: Date,
    name: string,
    avatar: string,
    subComments: CommentDto[]
}