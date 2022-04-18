import { ProductDetailDto } from "./ProductDetailDto";
import { ProductPromotionDto } from "./ProductPromotionDto";

export interface ProductDto {
    productId: number,
    productName: string,
    difficulty: number,
    description: string,
    weight: number,
    maxUserWeight: number,
    languageSupport: number;
    bodyFocus: string,
    tag: string,
    shopName: string,
    shopId?: number,
    facebook: string,
    isOutOfStock?: boolean,
    youtube: string,
    shopImage: string,
    productImages: string[],
    productVideos: string[],
    productPromotions: ProductPromotionDto[],
    productDetails: ProductDetailDto[]
}