import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Get, Query, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../users/get-user.decorator';
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {
    constructor (private commentsService: CommentsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createComment(
        @Body() createCommentDto: CreateCommentDto,
        @GetUser() user: User,    
    ): Promise<Comment> {
        return this.commentsService.createComment(createCommentDto, user)
    }

    @Get()
    getComments(
        @Query(ValidationPipe) getCommentsFilterDto: GetCommentsFilterDto,
        @GetUser() user: User,
        ): Promise<Comment[]> {
        return this.commentsService.getComments(getCommentsFilterDto, user)
    }

    // comment_id
    @Get('/:id')
    getCommentById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Comment> {
        return this.commentsService.getCommentById(id, user)
    }

    @Get('/:postId')
    getCommentByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @GetUser() user: User,
        ): Promise<Comment> {
        return this.commentsService.getCommentByPostId(postId, user)
    }
    

    @Patch('/:id/text')
    updateCommentText(
        @Param('id', ParseIntPipe) id: number,
        @Body('text') text: string,
        @GetUser() user: User,
    ): Promise<Comment> {
        return this.commentsService.updateCommentText(id, text, user)
    }

    @Delete('/:id')
    deleteComment(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<void> {
        return this.commentsService.deleteComment(id, user)
    }
}
