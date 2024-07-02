import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersCoreModule } from 'libs/ecommerce-core/src/orders/orders-core.module';

@Module({
  imports: [OrdersCoreModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
