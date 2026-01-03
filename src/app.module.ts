import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { DrugsModule } from './drugs/drugs.module';
import { DrugCategoryModule } from './drug-category/drug-category.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { InventorybatchModule } from './inventorybatch/inventorybatch.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    SessionModule,
    DrugsModule,
    DrugCategoryModule,
    SuppliersModule,
    InventorybatchModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
