import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ARTICLE_STATUS } from '../constants/article.constant';
import { Transform } from 'class-transformer';

export class CreateArticleDto {
    @IsNotEmpty()
    @IsEnum(ARTICLE_STATUS)
    status: ARTICLE_STATUS;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value == 'true')
    isPublic: boolean;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    publishDate: Date;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
