import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(userCredentailsDto: UserCredentialsDto): Promise<void> {
        return this.userRepository.signUp(userCredentailsDto)
    }

    async singIn(userCredentailsDto: UserCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(userCredentailsDto)

        if (!username) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = { username }
        const accessToken = await this.jwtService.sign(payload)

        return { accessToken }
    }

    async getUserById(
        id: number,
        ): Promise<User> {
        const found = await this.userRepository.findOne({ where: { id } })

        if (!found) {
            throw new NotFoundException(`User with id: ${id} not found`)
        }

        delete found.posts
        delete found.comments
        return found
    }

    async getPostsByUserId(
        id: number,
        ): Promise<Post> {
        const found = await this.userRepository.findOne({ where: { id } })

        if (!found) {
            throw new NotFoundException(`User with id: ${id} not found`)
        }

        return found.posts
    }
}
