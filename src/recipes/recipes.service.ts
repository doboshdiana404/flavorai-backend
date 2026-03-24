import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        ingredients: createRecipeDto.ingredients,
        instructions: createRecipeDto.instructions,
        cuisineType: createRecipeDto.cuisineType,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryRecipesDto) {
    const search = query.search?.trim();

    return this.prisma.recipe.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  async findMine(userId: string) {
    return this.prisma.recipe.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
