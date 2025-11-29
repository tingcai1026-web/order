export enum Category {
  NOODLES = '麵類',
  RICE_PORRIDGE = '飯・粥類',
  SIDES = '小菜類',
  SOUPS = '湯類',
  OTHERS = '其他'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  canAddNoodle: boolean; // True only for noodle items
}

export interface CartItem {
  itemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  isAddNoodle: boolean; // +10 dollars
  remarks: string;
}

export type OrderType = 'dine-in' | 'takeout';

export interface CompletedOrder {
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  orderType: OrderType;
  timestamp: Date;
}