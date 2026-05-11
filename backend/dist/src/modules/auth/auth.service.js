"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const password_util_1 = require("../../common/utils/password.util");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashed = await (0, password_util_1.hashPassword)(dto.password);
        const user = await this.userService.create({ email: dto.email, password: hashed });
        const { password: _, ...result } = user;
        return result;
    }
    async login(dto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        const isValid = await (0, password_util_1.comparePassword)(dto.password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        const { password: _, ...userResult } = user;
        return { access_token, user: userResult };
    }
    async getMe(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Pengguna tidak ditemukan');
        }
        const { password: _, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map