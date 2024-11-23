export interface AuthRequest {
    idUser?: string
    username: string,
    password: string,
    email?: string,
    name?: string,
    picture?: string
}
export interface AuthResponse {
    a: string,
    r?: string,
    ea: number,
    er?: number
}
export interface AuthLoginRequest extends AuthRequest { }
export interface AuthRegisterRequest extends AuthRequest {
    name: string,
    email: string
}