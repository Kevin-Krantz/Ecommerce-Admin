interface IProduct {
  title: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  properties?: { [key: string]: any };
}
