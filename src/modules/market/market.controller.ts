import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Market')
@ApiBearerAuth()
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('prices')
  @ApiOperation({ summary: 'Get market prices' })
  @ApiQuery({ name: 'commodity', required: false })
  @ApiQuery({ name: 'state', required: false })
  async getPrices(
    @Query('commodity') commodity?: string,
    @Query('state') state?: string,
  ) {
    return this.marketService.getPrices(commodity, state);
  }

  @Get('prices/:commodity')
  @ApiOperation({ summary: 'Get prices for a specific commodity' })
  async getCommodityPrices(@Param('commodity') commodity: string) {
    return this.marketService.getCommodityPrices(commodity);
  }

  @Get('watchlist')
  @ApiOperation({ summary: 'Get user watchlist' })
  async getWatchlist(@CurrentUser('id') userId: string) {
    return this.marketService.getWatchlist(userId);
  }

  @Post('watchlist')
  @ApiOperation({ summary: 'Add to watchlist' })
  async addToWatchlist(
    @CurrentUser('id') userId: string,
    @Body() body: { commodity: string; market?: string; targetPrice?: number },
  ) {
    return this.marketService.addToWatchlist(userId, body);
  }

  @Delete('watchlist/:id')
  @ApiOperation({ summary: 'Remove from watchlist' })
  async removeFromWatchlist(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.marketService.removeFromWatchlist(id, userId);
  }
}
