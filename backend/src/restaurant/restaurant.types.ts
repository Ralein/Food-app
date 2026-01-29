import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Country } from '../auth/auth.types';

@ObjectType()
export class Restaurant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Country)
  country: Country;

  @Field()
  address: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  category: string;

  @Field()
  isAvailable: boolean;

  @Field()
  restaurantId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
