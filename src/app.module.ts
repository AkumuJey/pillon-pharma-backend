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

@Module({
  imports: [UsersModule, DrugsModule, SalesModule, PharmacyModule, PaymentsModule, SubscriptionModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
