import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.prismaService.product.create({
        data: {
          ...createProductDto,
          externalImageURLs: {
            create:
              createProductDto.externalImageURLs?.map((url) => ({ url })) || [],
          },
        },
        include: {
          externalImageURLs: true,
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
      include: {
        externalImageURLs: true,
      },
    });
  }

  findOneProduct(id: string) {
    return this.prismaService.product.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        externalImageURLs: true,
      },
    });
  }

  updateProduct(id: string, updateProductDto: CreateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        externalImageURLs: {
          create: updateProductDto.externalImageURLs.map((url) => ({
            url,
          })),
        },
      },
      include: {
        externalImageURLs: true,
      },
    });
  }

  removeProduct(id: string) {
    return this.prismaService.product.delete({ where: { id } });
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
            unit: row['Unidade'],
            NCM: row['NCM'],
            origin: parseInt(row['Origem']),
            price: parseFloat(row['Preço']),
            valueIPI: parseFloat(row['Valor IPI fixo']),
            observations: row['Observações'],
            situation: row['Situação'],
            stock: parseFloat(row['Estoque']),
            costPrice: parseFloat(row['Preço de custo']),
            supplierCode: row['Cód. no fornecedor'],
            supplier: row['Fornecedor'],
            location: row['Localização'],
            maxStock: parseFloat(row['Estoque máximo']),
            minStock: parseFloat(row['Estoque mínimo']),
            netWeight: parseFloat(row['Peso líquido (Kg)']),
            grossWeight: parseFloat(row['Peso bruto (Kg)']),
            GTINEAN: row['GTIN/EAN'],
            GTINEANPackage: row['GTIN/EAN da Embalagem'],
            productWidth: parseFloat(row['Largura do produto']),
            productHeight: parseFloat(row['Altura do Produto']),
            productDepth: parseFloat(row['Profundidade do produto']),
            expirationDate: row['Data Validade']
              ? new Date(row['Data Validade'])
              : null,
            supplierProductDescription:
              row['Descrição do Produto no Fornecedor'],
            additionalDescription: row['Descrição Complementar'],
            itemsPerBox: parseFloat(row['Itens p/ caixa']),
            productVariation: row['Produto Variação'],
            productionType: row['Tipo Produção'],
            IPIClassification: row['Classe de enquadramento do IPI'],
            serviceListCode: row['Código na Lista de Serviços'],
            itemType: row['Tipo do item'],
            tags: row['Grupo de Tags/Tags'],
            tributes: parseFloat(row['Tributos']),
            parentCode: row['Código Pai'],
            integrationCode: parseInt(row['Código Integração']),
            productGroup: row['Grupo de produtos'],
            brand: row['Marca'],
            CEST: row['CEST'],
            volumes: parseInt(row['Volumes']),
            shortDescription: row['Descrição Curta'],
            crossDocking: parseFloat(row['Cross-Docking']),
            externalImageURLs: row['URL Imagens Externas'].split(';'),
            externalLink: row['Link Externo'],
            supplierWarrantyMonths: row['Meses Garantia no Fornecedor'],
            cloneParentData: row['Clonar dados do pai'],
            productCondition: row['Condição do Produto'],
            freeShipping: row['Frete Grátis'],
            FCI: row['Número FCI'],
            video: row['Vídeo'],
            department: row['Departamento'],
            unitOfMeasure: row['Unidade de Medida'],
            purchasePrice: parseFloat(row['Preço de Compra']),
            ICMSBaseRetentionValue: parseFloat(
              row['Valor base ICMS ST para retenção'],
            ),
            ICMSRetentionValue: parseFloat(row['Valor ICMS ST para retenção']),
            ICMSOwnSubstituteValue: parseFloat(
              row['Valor ICMS próprio do substituto'],
            ),
            productCategory: row['Categoria do produto'],
            additionalInformation: row['Informações Adicionais'],
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
                  // Unique constraint failed, so update the existing record
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
            fs.unlinkSync(file.path); // Delete the temporary file
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
        externalImageURLs: true,
      },
    });
    return children as any;
  }

  async findParentAndChildren(
    code: string,
  ): Promise<{ parent: CreateProductDto; children: CreateProductDto[] }> {
    try {
      // find parent
      const parent = await this.prismaService.product.findFirst({
        where: {
          code,
        },
        include: {
          externalImageURLs: true,
        },
      });

      if (!parent) {
        throw new Error(`Produto com código ${code} não encontrado.`);
      }

      // find all children
      const children = await this.prismaService.product.findMany({
        where: {
          parentCode: code,
        },
        include: {
          externalImageURLs: true,
        },
      });

      return { ...parent, ...children } as any;
    } catch (error) {
      this.logger.error(`Erro ao buscar produto e filhos: ${error.message}`);
      throw error;
    }
  }

  async findAllWithChildren() {
    this.logger.log('Fetching all products...');
    const allProducts = await this.prismaService.product.findMany();

    this.logger.log(`Found ${allProducts.length} products.`);

    const parentsWithChildren = [];
    const parentsWithoutChildren = [];
    const childrenSet = new Set(
      allProducts.map((product) => product.parentCode).filter((code) => code),
    );

    for (const product of allProducts) {
      if (childrenSet.has(product.code)) {
        const children = await this.prismaService.product.findMany({
          where: {
            parentCode: product.code,
          },
          include: {
            externalImageURLs: true,
          },
        });

        parentsWithChildren.push({ parent: product, children });
      } else if (!product.parentCode || product.parentCode === '') {
        const productWithImages = await this.prismaService.product.findUnique({
          where: {
            id: product.id,
          },
          include: {
            externalImageURLs: true,
          },
        });
        parentsWithoutChildren.push(productWithImages);
      }
    }

    this.logger.log('Finished separating all products.');
    this.logger.log(
      `Total parents with children: ${parentsWithChildren.length}`,
    );
    this.logger.log(
      `Total parents without children: ${parentsWithoutChildren.length}`,
    );

    return {
      parentsWithChildren,
      parentsWithoutChildren,
    };
  }

  async saveMessageAsProduct() {
    try {
      const productMessageUrl =
        'https://www.amazon.com/Razer-BlackWidow-Mechanical-Gaming-Keyboard/dp/B0BV4BC7LV/ref=sr_1_1_sspa?_encoding=UTF8&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&dib=eyJ2IjoiMSJ9.N39cGS2DIJptv7_LrdUM-bxAVNGzQx7CP80nqhvjXF4nP3-3zgJ_9O9jkn4DplJIQoIb9B_agrxTRQ8Umj6n4MAnJWJULwSUX4nHQzno6yllMQEnZLuL5jzHhh6_66Vd_ZVAK_i4yX38Xbz6r8Yb01MtYV4Po6zG57leKmhpNYG1Vn_KT7TZ3iQoQqOGzKXeNBod9qoN2E0hBYZmvW2fD-p2gM_ZFKVwyvxDe5cupxs.2HdkRXC5AScowNokHqR37V3svWPouoC5BhQrYl735EM&dib_tag=se&keywords=gaming%2Bkeyboard&pd_rd_r=05bf0897-1646-4522-bfa7-aaa54c015715&pd_rd_w=tT7OA&pd_rd_wg=m1ufT&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=43DC4E1XCGDG0HD52MDQ&qid=1719351690&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1';
      const { data } = await axios.get(productMessageUrl);

      const $ = cheerio.load(data);
      const [descriptionMessage] = $('#productTitle').text().trim().split('\n');
      console.log('Message:', descriptionMessage);

      // select all images
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
}
