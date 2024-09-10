export interface AuthRequest {
    username: string,
    password: string
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