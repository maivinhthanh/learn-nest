import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];
}
