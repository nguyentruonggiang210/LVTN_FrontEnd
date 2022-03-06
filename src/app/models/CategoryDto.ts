export interface CategoryDto{
    id: string,
    image: string,
    name: string,
    avatar: string,
    price?: number,
    description: string,
    type: string,
    typeId: number,
    published: Date,
    difficulty: string,
    rate: number,
    minCalorieBurn: number,
    maxCalorieBurn: number,
    bodyFocus: string,
    memberShip: string,
    tag: string
}