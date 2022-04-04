export interface SendCommentDto {
    userId: string,
    courseId?: number,
    productId?: number,
    parentCommentId?: number,
    content: string
}