interface IProductData {
  name: string;
}

interface IPriceData {
  currency: string;
  product_data: IProductData;
  unit_amount: number;
}

interface ILineItem {
  quantity: number;
  price_data: IPriceData;
}

interface IOrder {
  line_items: ILineItem[];
  name: string;
  email: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  country: string;
  paid: boolean;
}
