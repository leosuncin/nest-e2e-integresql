import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategory {
  @IsDefined()
  @IsString()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name!: string;
}
