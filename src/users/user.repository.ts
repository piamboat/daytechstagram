import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
        const { username, password } = userCredentialsDto

        const user = new User
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        
        try {
            await user.save()
        }
        catch (error)
        {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('username is already existed')
            }
            else
            {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(userCredentialsDto: UserCredentialsDto): Promise<string> {
        const { username, password } = userCredentialsDto
        const user = await this.findOne({ username })

        if ( user && await user.validatePassword(password) ) {
            return user.username
        }
        else
        {
            return null
        }
    }
}