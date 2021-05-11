import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentRepository)
        private commentRepository: CommentRepository
    ) {} 

    async createComment(
        createCommentDto: CreateCommentDto,
        user: User,
    ): Promise<Comment> {
        return this.commentRepository.createComment(createCommentDto, user)
    }

    async getComments(
        getCommentFilterDto: GetCommentsFilterDto,
        user: User,
        ): Promise<Comment[]> {
        return this.commentRepository.getComments(getCommentFilterDto, user)
    }

    // comment_id
    async getCommentById(
        id: number,
        user: User,
        ): Promise<Comment> {
        const found = await this.commentRepository.findOne({ where: { id, userId: user.id } })

        if (!found) {
            throw new NotFoundException(`Comment with id: ${id} not found`)
        }

        return found
    }

    async getCommentByPostId(
        postId: number,
        user: User,
        ): Promise<Comment> {
        const found = await this.commentRepository.findOne({ where: { postId, userId: user.id } })

        if (!found) {
            throw new NotFoundException(`Comment with id: ${postId} not found`)
        }

        return found
    }

    async updateCommentText(
        id: number,
        text: string,
        user: User
        ): Promise<Comment> {
        const comment = await this.getCommentById(id, user)
        comment.text = text
        await comment.save()
        
        return comment
    }

    async deleteComment(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.commentRepository.delete({ id, userId: user.id })

        if (result.affected === 0) {
            throw new NotFoundException(`Comment with id: ${id} not found`)
        }
    }
}
