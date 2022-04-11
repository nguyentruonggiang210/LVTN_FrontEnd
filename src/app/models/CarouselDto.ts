export interface CarouselDto {
    details: CarouselDetailDto[]
}

export interface CarouselDetailDto {
    id: number,
    name: string,
    image: string
}