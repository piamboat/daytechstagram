import { Body, Controller, Get, Post, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { Post as post } from 'src/posts/post.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) userCredentialsDto: UserCredentialsDto): Promise<void> {
        return this.usersService.signUp(userCredentialsDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) userCredentailsDto: UserCredentialsDto): Promise<{ accessToken: string }> {
        return this.usersService.singIn(userCredentailsDto)
    }

    @Get('/:id')
    getUserById(
        @Param('id', ParseIntPipe) id: number,
        ): Promise<User> {
        return this.usersService.getUserById(id)
    }

    @Get('/:id/posts')
    getPostsByUserId(
        @Param('id', ParseIntPipe) id: number,
        ): Promise<post> {
        return this.usersService.getPostsByUserId(id)
    }
}
