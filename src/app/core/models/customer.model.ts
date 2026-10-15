export type CustomerDocumentType = 'DNI' | 'RUC';
export type CustomerType = 'Persona' | 'Empresa';
export type CustomerStatus = 'Activo' | 'Inactivo';

export interface PurchaseRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Entregado' | 'Pendiente';
}

export interface CustomerDocument {
  name: string;
  type: 'Crédito' | 'Legal' | 'Identidad';
  uploadedAt: string;
}

export interface Customer {
  id: string;
  documentType: CustomerDocumentType;
  documentNumber: string;
  customerType: CustomerType;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  siteId: string;
  status?: CustomerStatus;
  purchases?: PurchaseRecord[];
  documents?: CustomerDocument[];
  creditLimit?: number;
}
