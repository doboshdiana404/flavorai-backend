import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { RatingsService } from './ratings.service';

@Controller('recipes/:id/rating')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  rateRecipe(
    @Param('id') recipeId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() body: { value: number }
  ) {
    return this.ratingsService.rateRecipe(user.id, recipeId, body.value);
  }
}
