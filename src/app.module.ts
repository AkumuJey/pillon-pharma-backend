import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DrugsModule } from './drugs/drugs.module';
import { SalesModule } from './sales/sales.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DrugsModule,
    SalesModule,
    PharmacyModule,
    PaymentsModule,
    SubscriptionModule,
    AnalyticsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
