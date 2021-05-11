import { EntityRepository, Repository } from "typeorm";
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    async createComment(
        createCommentDto: CreateCommentDto,
        user: User,
        ): Promise<Comment> {
        const { text } = createCommentDto

        const comment = new Comment()
        comment.text = text
        comment.user = user
        await comment.save()

        delete comment.user //it doesn't delete comment.user in database, just delete information of user before return response to the frontend
        return comment
    }

    async getComments(
        getCommentsFilterDto: GetCommentsFilterDto,
        user: User,
        ): Promise<Comment[]> {
        const { search } = getCommentsFilterDto
        const query = this.createQueryBuilder('comment')

        // find post belong to that user
        query.where('comment.userId = :userId', { userId: user.id })

        if (search) {
            query.andWhere('(comment.text LIKE :search)', { search: `%${search}%` })
        }

        const comments = await query.getMany()
        return comments
    }
}