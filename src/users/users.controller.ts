import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

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
}
