import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
