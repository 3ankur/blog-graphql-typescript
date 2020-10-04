import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field()
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  createdAt: Date;

  @Field(() => String)
  @Column()
  updatedAt: Date;
}
