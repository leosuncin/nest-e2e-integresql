import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomer {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly firstName!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly lastName!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  readonly email!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  @IsPhoneNumber()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly street?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly city?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  readonly state?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  readonly zipCode?: string;
}
