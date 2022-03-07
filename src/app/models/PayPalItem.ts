import { UnitAmount } from "./UnitAmount";

export interface PayPalItem {
    name: string,
    quantity: string,
    category: string,
    unit_amount: UnitAmount,
}