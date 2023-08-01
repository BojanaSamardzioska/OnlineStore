export interface CartItem {
     productId: number;
     title: string;
     productTypeId?: number;
     productType?: string;
     imageUrl: string;
     price: number;
     quantity: number;
}


export interface AddCartItem {
     userId: number;
     productId: number;
     quantity: number;
}