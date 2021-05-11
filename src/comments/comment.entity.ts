import { Post } from 'src/posts/post.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(type => User, user => user.comments, { eager: false })
    user: User

    @Column()
    userId: number

    @ManyToOne(type => Post, post => post.comments, { eager: false })
    post: Post

    @Column()
    postId: number
}