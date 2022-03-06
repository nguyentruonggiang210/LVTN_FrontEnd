export interface OdataResponse<T> {
    items: T,
    nextPageLink: string,
    count: number
}