import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/user.entity';
import { Post } from './post.entity';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository: PostRepository
    ) {} 

    async createPost(
        createPostDto: CreatePostDto,
        user: User,
        image: Express.Multer.File
    ): Promise<Post> {
        return this.postRepository.createPost(createPostDto, user, image)
    }

    async getPosts(
        getPostFilterDto: GetPostsFilterDto,
        user: User,
        ): Promise<Post[]> {
        return this.postRepository.getPosts(getPostFilterDto, user)
    }

    async getPostById(
        id: number,
        user: User,
        ): Promise<Post> {
        const found = await this.postRepository.findOne({ where: { id, userId: user.id } })

        if (!found) {
            throw new NotFoundException(`Post with id: ${id} not found`)
        }

        return found
    }

    async updatePostText(
        id: number,
        text: string,
        user: User
        ): Promise<Post> {
        const post = await this.getPostById(id, user)
        post.text = text
        await post.save()
        
        return post
    }

    async deletePost(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.postRepository.delete({ id, userId: user.id })

        if (result.affected === 0) {
            throw new NotFoundException(`Post with id: ${id} not found`)
        }
    }
}
