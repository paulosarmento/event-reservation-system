import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Product } from '@prisma/client';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { categoryIds, ...productData } = createProductDto;

      const product = await this.prismaService.product.create({
        data: {
          ...productData,
          externalImageURLs: {
            create: createProductDto.externalImageURLs?.map((url) => ({ url })),
          },
          productCategories: {
            create: categoryIds?.map((categoryId) => ({ categoryId })),
          },
        },
        include: {
          externalImageURLs: true,
          productCategories: {
            include: {
              Category: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }

  findAllParents() {
    return this.prismaService.product.findMany({
      where: {
        OR: [{ parentCode: null }, { parentCode: '' }],
      },
      select: {
        id: true,
        code: true,
        description: true,
        price: true,
        situation: true,
        parentCode: true,
        externalImageURLs: {
          select: {
            url: true,
          },
        },
        productCategories: {
          select: {
            Category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneProduct(id: string) {
    const productChildren = await this.prismaService.product.findMany({
      where: { parentCode: id },
      include: {
        externalImageURLs: true,
        productCategories: {
          include: {
            Category: true,
          },
        },
      },
    });
    if (productChildren.length > 0) {
      return productChildren;
    }

    const productParent = await this.prismaService.product.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        externalImageURLs: {
          select: {
            id: true,
            url: true,
          },
        },
        productCategories: {
          select: {
            Category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return [productParent, ...productChildren];
  }

  async updateProduct(id: string, updateProductDto: CreateProductDto) {
    const { categoryIds, ...productData } = updateProductDto;
    return this.prismaService.product.update({
      where: { id },
      data: {
        ...productData,
        externalImageURLs: {
          create: updateProductDto.externalImageURLs?.map((url) => ({ url })),
        },
        productCategories: {
          create: categoryIds?.map((categoryId) => ({ categoryId })),
        },
      },
      include: {
        externalImageURLs: true,
        productCategories: {
          include: {
            Category: true,
          },
        },
      },
    });
  }

  async removeProduct(id: string) {
    try {
      const dependentCategories = await this.prismaService.category.findMany({
        where: {
          productCategories: {
            some: {
              productId: id,
            },
          },
        },
      });

      for (const category of dependentCategories) {
        await this.prismaService.category.update({
          where: { id: category.id },
          data: {
            productCategories: {
              deleteMany: {
                productId: id,
              },
            },
          },
        });
      }
      await this.prismaService.externalImageURLs.deleteMany({
        where: {
          productId: id,
        },
      });
      await this.prismaService.product.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async importProducts(file: Express.Multer.File) {
    const products: CreateProductDto[] = [];
    const stream = fs.createReadStream(file.path);

    return new Promise((resolve, reject) => {
      fastCsv
        .parseStream(stream, { headers: true, delimiter: ';' })
        .on('data', async (row) => {
          for (const key in row) {
            if (typeof row[key] === 'string') {
              row[key] = row[key].replace(/\t/g, '');
            }
          }
          const product: CreateProductDto = {
            id: row['ID'],
            code: row['Código'],
            description: row['Descrição'],
            price: parseFloat(row['Preço']),
            parentCode: row['Código Pai'],
            externalImageURLs: row['URL Imagens Externas'].split(';'),
          };

          products.push(product);
        })
        .on('end', async () => {
          try {
            for (const product of products) {
              try {
                await this.prismaService.product.create({
                  data: {
                    ...product,
                    externalImageURLs: {
                      create: product.externalImageURLs.map((url) => ({
                        url,
                      })),
                    },
                  },
                });
              } catch (error) {
                if (error.code === 'P2002') {
                  await this.prismaService.product.update({
                    where: { id: product.id },
                    data: {
                      ...product,
                      externalImageURLs: {
                        create: product.externalImageURLs.map((url) => ({
                          url,
                        })),
                      },
                    },
                  });
                } else {
                  throw error;
                }
              }
            }
            resolve({
              message: 'Products imported successfully',
              count: products.length,
            });
          } catch (error) {
            reject(error);
          } finally {
            fs.unlinkSync(file.path);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async findChildrenByParentCode(
    parentCode: string,
  ): Promise<CreateProductDto[]> {
    const children = await this.prismaService.product.findMany({
      where: {
        parentCode,
      },
      include: {
        externalImageURLs: {
          select: {
            url: true,
          },
        },
        productCategories: {
          include: {
            Category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return children as any;
  }

  async findParentAndChildren(
    code: string,
  ): Promise<{ parent: CreateProductDto; children: CreateProductDto[] }> {
    try {
      const parent = await this.prismaService.product.findFirst({
        where: { code },
        include: {
          externalImageURLs: {
            select: {
              url: true,
            },
          },
          productCategories: {
            include: {
              Category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!parent) {
        throw new Error(`Produto com código ${code} não encontrado.`);
      }

      const children = await this.prismaService.product.findMany({
        where: { parentCode: code },
        include: {
          externalImageURLs: {
            select: {
              url: true,
            },
          },
          productCategories: {
            include: {
              Category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return { parent, children } as any;
    } catch (error) {
      this.logger.error(`Erro ao buscar produto e filhos: ${error.message}`);
      throw error;
    }
  }

  async findAllWithChildren() {
    const allProducts = await this.prismaService.product.findMany({
      include: {
        externalImageURLs: {
          select: {
            url: true,
          },
        },
      },
    });

    const parentsWithChildren = [];
    const parentsWithoutChildren = [];
    const childrenSet = new Set(
      allProducts.map((product) => product.parentCode).filter((code) => code),
    );

    for (const product of allProducts) {
      if (childrenSet.has(product.code)) {
        const children = await this.prismaService.product.findMany({
          where: { parentCode: product.code },
          include: {
            externalImageURLs: {
              select: {
                url: true,
              },
            },
          },
        });

        parentsWithChildren.push({ parent: product, children });
      } else if (!product.parentCode || product.parentCode === '') {
        parentsWithoutChildren.push(product);
      }
    }

    return {
      parentsWithChildren,
      parentsWithoutChildren,
    };
  }

  async saveMessageAsProduct() {
    try {
      const productMessageUrl =
        'https://www.amazon.com.br/Echo-Pop-Cor-Preta/dp/B09WXVH7WK/?_encoding=UTF8&pd_rd_w=I94Ph&content-id=amzn1.sym.8fbb3d34-c3f1-46af-9d99-fd6986f6ec8f&pf_rd_p=8fbb3d34-c3f1-46af-9d99-fd6986f6ec8f&pf_rd_r=ABB0N2DFKT2ZHQ9BZAB9&pd_rd_wg=TY8yi&pd_rd_r=072e1c37-b479-458f-82f2-10631cf6f3a7&ref_=pd_hp_d_btf_crs_zg_bs_16333486011';
      const { data } = await axios.get(productMessageUrl);

      const $ = cheerio.load(data);
      const [descriptionMessage] = $('#productTitle').text().trim().split('\n');
      console.log('Message:', descriptionMessage);

      const imageUrls = [];
      $('#altImages img').each((index, element) => {
        const imgUrl = $(element).attr('src');
        if (imgUrl) {
          imageUrls.push(imgUrl);
        }
      });
      console.log('Image URLs:', imageUrls);

      const createProductDto: CreateProductDto = {
        description: descriptionMessage,
        externalImageURLs: imageUrls,
      };

      const product = await this.create(createProductDto);
      return product;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }
  async removeProductImage(productId: string, imageId: string) {
    try {
      await this.prismaService.externalImageURLs.delete({
        where: {
          id: imageId,
          productId: productId,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
