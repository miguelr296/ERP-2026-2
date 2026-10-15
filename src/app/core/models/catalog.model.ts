export interface CatalogProduct {
  sku: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  accent: 'teal' | 'blue' | 'orange' | 'purple';
}

export interface SiteStock {
  sku: string;
  siteId: string;
  physical: number;
  reserved: number;
}

export interface StockMovement {
  id: string;
  sku: string;
  siteId: string;
  type: 'Reserva' | 'Liberación' | 'Traslado' | 'Reposición';
  quantity: number;
  fromSite?: string;
  toSite?: string;
  createdAt: string;
}
