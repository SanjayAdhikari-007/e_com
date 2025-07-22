export interface Product {
    id: string;
    title: string;
    detail: string;
    price: number;
    category: string;
    brandName: string;
    pattern: string;
    color: string;
    discountRate: number;
    priceAfterDiscount: number;
    rating: number;
    images: string[];
    isInStock: boolean;
    isFeatured: boolean;
    isPopular: boolean;
    createdAt: Date;
  }