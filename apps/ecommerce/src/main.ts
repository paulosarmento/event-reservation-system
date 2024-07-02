import { NestFactory } from '@nestjs/core';
import { EcommerceModule } from './ecommerce.module';

async function bootstrap() {
  const app = await NestFactory.create(EcommerceModule);
  await app.listen(3000);
}
bootstrap();
