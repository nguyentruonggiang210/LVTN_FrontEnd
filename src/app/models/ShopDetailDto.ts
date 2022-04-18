import { ShopDto } from "./admin/ShopDto";
import { CarouselDetailDto } from "./CarouselDto";

export interface ShopDetailDto extends ShopDto {
    products: CarouselDetailDto[]
}