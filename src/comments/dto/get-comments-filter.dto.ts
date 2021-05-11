import { IsNotEmpty, IsOptional } from "class-validator";

export class GetCommentsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string
}