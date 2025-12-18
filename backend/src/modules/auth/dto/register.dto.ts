import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя (минимум 8 символов)',
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsString()
  @IsOptional()
  firstName?: string;


  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
