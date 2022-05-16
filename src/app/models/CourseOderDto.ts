export interface CourseOderDto {
    courseId: number,
    courseName: string,
    rooms?: RoomOrderDto[]
}

export interface RoomOrderDto {
    startTime: Date,
    endTime: Date,
    roomId: number
}