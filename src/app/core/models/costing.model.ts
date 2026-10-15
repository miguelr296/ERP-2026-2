export type CostingStatus = 'Recibida' | 'En diseño' | 'Costeada';

export interface CostingStatusChange {
  status: CostingStatus;
  changedAt: string;
  changedBy: string;
  comment?: string;
}

export interface CostingRequest {
  id: string;
  customerId: string;
  customerName: string;
  opportunityId: string;
  projectName: string;
  description: string;
  commitmentDate: string;
  attachments: string[];
  requester: string;
  siteId: string;
  status: CostingStatus;
  createdAt: string;
  statusHistory?: CostingStatusChange[];
  comments?: string[];
}
