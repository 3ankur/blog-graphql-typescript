import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column()
  createdAt: Date;

  @Field(() => String)
  @Column()
  updatedAt: Date;
}
