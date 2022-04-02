export interface CreateUserManagementDto{
    userName: string,
    password: string,
    confirmPassword: string,
    address: string,
    name: string,
    email: string,
    age: number,
    gender: number,
    avatar: string,
    status: boolean
    roleNames: string[]
}