import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Query, UseGuards, Param, ParseIntPipe, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from '../users/user.entity';
import { Post as post } from './post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
    constructor (private postsService: PostsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(ValidationPipe)
    createPost(
        @UploadedFile() image: Express.Multer.File,
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User,    
    ): Promise<post> {
        return this.postsService.createPost(createPostDto, user, image)
    }

    @Get()
    getPosts(
        @Query(ValidationPipe) getPostsFilterDto: GetPostsFilterDto,
        @GetUser() user: User,
        ): Promise<post[]> {
        return this.postsService.getPosts(getPostsFilterDto, user)
    }

    @Get('/:id')
    getPostById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<post> {
        return this.postsService.getPostById(id, user)
    }

    @Patch('/:id/text')
    updatePostText(
        @Param('id', ParseIntPipe) id: number,
        @Body('text') text: string,
        @GetUser() user: User,
    ): Promise<post> {
        return this.postsService.updatePostText(id, text, user)
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<void> {
        return this.postsService.deletePost(id, user)
    }
}
