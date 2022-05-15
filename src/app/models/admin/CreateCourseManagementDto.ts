import { ImageDto } from "../ImageDto";

export interface CreateCourseManagementDto {
    courseId?: number,
    courseName: string,
    startDate: Date,
    courseType: number,
    endDate: Date,
    teacherName: string,
    member: number,
    difficulty: number,
    sessionPerWeek?: number,
    price: number,
    bodyFocus: string[],
    tag: string[],
    description: string,
    userId: string,
    images?: ImageDto[]
    video?: string
}