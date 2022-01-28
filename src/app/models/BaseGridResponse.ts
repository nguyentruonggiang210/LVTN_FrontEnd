export interface BaseGridResponse<T>{
    body: T,
    total: number,
    skip: number,
    take: number
}
