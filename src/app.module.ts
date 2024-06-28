import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
// import { PrismaModule } from './prisma/prisma.module';
import { SpotsModule } from './spots/spots.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'libs/events-core/src/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from 'libs/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    EventsModule,
    SpotsModule,
    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
