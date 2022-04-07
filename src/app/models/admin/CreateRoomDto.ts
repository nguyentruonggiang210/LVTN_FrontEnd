export interface CreateRoomDto {
    courseId: number,
    roomId?: number,
    maxMember: number,
    currentUser?: number,
    startTime: Date,
    endTime: Date,
    userId: string,
    status?: boolean,
    userIds: string[]
}