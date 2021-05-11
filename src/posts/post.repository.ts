import { EntityRepository, Repository } from "typeorm";
import { Post } from './post.entity';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import * as fsExtra from 'fs-extra';
import { extname } from 'path';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    async createPost(
        createPostDto: CreatePostDto,
        user: User,
        image: Express.Multer.File
        ): Promise<Post> {
        const { text } = createPostDto

        const post = new Post()
        post.text = text
        post.user = user

        await post.save()

        if (image) {
            const imageFile = post.id + extname(image.originalname)
            fsExtra.move( image.path, `upload/${imageFile}` )
            post.image = imageFile
            await post.save()
        }

        delete post.user //it doesn't delete post.user in database, just delete information of user before return response to the frontend
        return post
    }

    async getPosts(
        getPostsFilterDto: GetPostsFilterDto,
        user: User,
        ): Promise<Post[]> {
        const { search } = getPostsFilterDto
        const query = this.createQueryBuilder('post')

        // find post belong to that user
        query.where('post.userId = :userId', { userId: user.id })

        if (search) {
            query.andWhere('(post.text LIKE :search)', { search: `%${search}%` })
        }

        const posts = await query.getMany()
        return posts
    }
}