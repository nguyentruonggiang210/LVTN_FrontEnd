export interface CourseManagementDto {
    courseId: number;
    courseName: string;
    trainerName: string,
    startDate: Date,
    endDate: Date,
    status: boolean,
    image: string,
    trainerUsername: string
}