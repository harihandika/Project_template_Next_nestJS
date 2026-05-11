import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface UserResponse {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface LoginResponse {
    access_token: string;
    user: UserResponse;
}
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<UserResponse>;
    login(dto: LoginDto): Promise<LoginResponse>;
    getMe(userId: string): Promise<UserResponse>;
}
