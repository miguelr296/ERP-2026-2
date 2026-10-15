import { Injectable, signal } from '@angular/core';
import { CostingRequest, CostingStatus } from '../models/costing.model';

const STORAGE_KEY = 'famihogar.erp.costing-requests';

const DEMO_REQUESTS: CostingRequest[] = [
  { id: 'MTO-2026-0001', customerId: 'CLI-0002', customerName: 'Corporación Robles S.A.C.', opportunityId: 'OPP-2026-0002', projectName: 'Mobiliario integral para oficinas', description: 'Diseño y fabricación de estaciones de trabajo para 48 personas.', commitmentDate: '2026-10-12', attachments: ['layout-oficinas.pdf'], requester: 'ejecutivo.b2b', siteId: 'lima', status: 'En diseño', createdAt: '2026-10-02' },
  { id: 'MTO-2026-0002', customerId: 'CLI-0001', customerName: 'María Fernanda Salazar', opportunityId: 'OPP-2026-0001', projectName: 'Centro de entretenimiento a medida', description: 'Mueble de TV con almacenamiento y acabado nogal.', commitmentDate: '2026-10-20', attachments: [], requester: 'asesor.showroom', siteId: 'lima', status: 'Recibida', createdAt: '2026-10-04' }
];

@Injectable({ providedIn: 'root' })
export class CostingService {
  readonly requests = signal<CostingRequest[]>(this.restore());

  create(data: Omit<CostingRequest, 'id' | 'createdAt' | 'status'>): CostingRequest {
    const request: CostingRequest = { ...data, id: `MTO-${new Date().getFullYear()}-${String(this.requests().length + 1).padStart(4, '0')}`, createdAt: new Date().toISOString().slice(0, 10), status: 'Recibida', statusHistory: [{ status: 'Recibida', changedAt: new Date().toISOString(), changedBy: data.requester }] };
    const updated = [request, ...this.requests()];
    this.requests.set(updated);
    this.persist(updated);
    return request;
  }

  updateStatus(id: string, status: CostingStatus, changedBy = 'oficina.tecnica', comment = ''): void {
    const updated = this.requests().map((request) => request.id === id ? { ...request, status, statusHistory: [...(request.statusHistory ?? []), { status, changedAt: new Date().toISOString(), changedBy, ...(comment ? { comment } : {}) }], comments: comment ? [...(request.comments ?? []), comment] : request.comments } : request);
    this.requests.set(updated);
    this.persist(updated);
  }

  isOverdue(request: CostingRequest): boolean {
    return request.status !== 'Costeada' && request.commitmentDate < new Date().toISOString().slice(0, 10);
  }

  isNearDue(request: CostingRequest): boolean {
    if (request.status === 'Costeada' || this.isOverdue(request)) return false;
    const days = (new Date(request.commitmentDate).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000;
    return days <= 3;
  }

  isFutureDate(date: string): boolean {
    return Boolean(date) && date > new Date().toISOString().slice(0, 10);
  }

  private persist(requests: CostingRequest[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(requests)); }

  private restore(): CostingRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as CostingRequest[] : DEMO_REQUESTS;
      return Array.isArray(parsed) && parsed.every((request) => request && typeof request.id === 'string' && typeof request.customerId === 'string') ? parsed : DEMO_REQUESTS;
    }
    catch { return DEMO_REQUESTS; }
  }
}
