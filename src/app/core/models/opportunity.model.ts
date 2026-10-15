export type OpportunityType = 'Retail' | 'B2B / licitación';
export type OpportunityStatus = 'Nueva' | 'En evaluación' | 'Derivada' | 'Ganada' | 'Perdida';

export interface OpportunityActivity {
  date: string;
  status: OpportunityStatus;
  note: string;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  channel: 'Showroom' | 'Correo' | 'Llamada' | 'Licitación';
  siteId: string;
  customerId: string;
  customerName: string;
  products: string;
  executive: string;
  status: OpportunityStatus;
  createdAt: string;
  attachments?: string[];
  nextActivity?: string;
  activities?: OpportunityActivity[];
}
