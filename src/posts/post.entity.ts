import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'noimage.jpeg' })
    image: string

    @Column()
    text: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(type => User, user => user.posts, { eager: false })
    user: User

    @Column()
    userId: number

    @OneToMany(type => Comment, comment => comment.post, { eager: true })
    comments: Comment
}