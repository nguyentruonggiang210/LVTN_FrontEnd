import { ProductPromotionDto } from "./ProductPromotionDto"

export interface CourseDto {
    courseId: number,
    name: string,
    difficulty?: number
    description: string,
    startDate: Date,
    endDate: Date,
    quantity: number,
    price: number,
    teacherName: string,
    teacherUserName: string,
    bodyFocus: string,
    tag: string,
    isOutOfStock?: boolean,
    courseVideo: string,
    teacherAvatar: string,
    coursePromotions: ProductPromotionDto[]
}