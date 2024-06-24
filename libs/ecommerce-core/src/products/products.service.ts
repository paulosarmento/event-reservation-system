import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<void> {
    try {
      await this.prismaService.product.create({
        data: createProductDto,
      });
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
    });
  }

  findOneProduct(id: string) {
    return this.prismaService.product.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    });
  }

  updateProduct(id: string, updateProductDto: CreateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
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
            externalImageURLs: row['URL Imagens Externas'],
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
                  data: product,
                });
              } catch (error) {
                if (error.code === 'P2002') {
                  // Unique constraint failed, so update the existing record
                  await this.prismaService.product.update({
                    where: { id: product.id },
                    data: product,
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
    });
    return children;
  }
  async findParentAndChildren(code: string): Promise<CreateProductDto[]> {
    const parent = await this.prismaService.product.findFirst({
      where: {
        code,
      },
    });

    if (!parent) {
      throw new Error(`Produto com código ${code} não encontrado.`);
    }

    // Find all children
    const children = await this.prismaService.product.findMany({
      where: {
        parentCode: code,
      },
    });

    //  Combine parent and children
    const parentAndChildren: CreateProductDto[] = [parent, ...children];

    return parentAndChildren;
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
        });

        parentsWithChildren.push({ parent: product, children });
      } else if (!product.parentCode || product.parentCode === '') {
        parentsWithoutChildren.push(product);
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
}
