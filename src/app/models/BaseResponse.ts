export interface BaseResponse<T>
{
    body: T,
    hasError: boolean,
    error: string
}