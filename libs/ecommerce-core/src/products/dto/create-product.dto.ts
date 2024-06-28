export class CreateProductDto {
  id?: string;
  code?: string;
  description?: string;
  price?: number;
  situation?: string;
  parentCode?: string;
  externalImageURLs?: string[];
  categoryIds?: string[];
}
