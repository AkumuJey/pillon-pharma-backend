import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  create() {
    return this.analyticsService.salesOverTime();
  }

  @Get()
  findAll() {
    return 'ADD';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `eferverfv ${id}`;
  }
}
