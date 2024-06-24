import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '@app/ecommerce-core';
import { CreateProductRequestDto } from './requestDto/create-product.dto';
import { UpdateProductRequestDto } from './requestDto/update-product.dto';
import { Express } from 'express';
import { CreateProductDto } from '@app/ecommerce-core/products/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductRequestDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('parent')
  async findAllWithChildren() {
    return await this.productsService.findAllWithChildren();
  }

  @Get()
  findAllParents() {
    return this.productsService.findAllParents();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductRequestDto: UpdateProductRequestDto,
  ) {
    return this.productsService.updateProduct(id, updateProductRequestDto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.importProducts(file);
  }

  @Get(':parentCode/children')
  async findChildrenByParentCode(
    @Param('parentCode') parentCode: string,
  ): Promise<CreateProductDto[]> {
    return this.productsService.findChildrenByParentCode(parentCode);
  }
  @Get(':parentCode/parentandchildren')
  async findParentAndChildren(
    @Param('parentCode') parentCode: string,
  ): Promise<CreateProductDto[]> {
    return this.productsService.findParentAndChildren(parentCode);
  }
}
