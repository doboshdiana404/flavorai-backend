import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createRecipeDto: CreateRecipeDto
  ) {
    return this.recipesService.create(user.id, createRecipeDto);
  }

  @Get()
  findAll(@Query() query: QueryRecipesDto) {
    return this.recipesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@CurrentUser() user: CurrentUserType) {
    return this.recipesService.findMine(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }
}
