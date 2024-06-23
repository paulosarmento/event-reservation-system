import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
// import { PrismaModule } from './prisma/prisma.module';
import { SpotsModule } from './spots/spots.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'libs/events-core/src/auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    EventsModule,
    SpotsModule,
    ProductsModule,
  ],
})
export class AppModule {}
