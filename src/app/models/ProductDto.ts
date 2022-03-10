import { ProductDetailDto } from "./ProductDetailDto";
import { ProductPromotionDto } from "./ProductPromotionDto";

export interface ProductDto {
    productId: number,
    productName: string,
    difficulty: number,
    productImages: string[],
    productVideos: string[],
    productPromotions: ProductPromotionDto[],
    productDetails: ProductDetailDto[]
}