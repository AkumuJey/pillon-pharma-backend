import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DrugsModule } from './drugs/drugs.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [UsersModule, DrugsModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
