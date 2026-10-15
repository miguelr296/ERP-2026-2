import { Injectable, signal } from '@angular/core';
import { Opportunity, OpportunityStatus } from '../models/opportunity.model';

const STORAGE_KEY = 'famihogar.erp.opportunities';

const DEMO_OPPORTUNITIES: Opportunity[] = [
  { id: 'OPP-2026-0001', type: 'Retail', channel: 'Showroom', siteId: 'lima', customerId: 'CLI-0001', customerName: 'María Fernanda Salazar', products: 'Sofá modular Oslo, mesa lateral', executive: 'asesor.showroom', status: 'En evaluación', createdAt: '2026-10-01', nextActivity: '2026-10-12', activities: [{ date: '2026-10-01', status: 'Nueva', note: 'Oportunidad registrada' }] },
  { id: 'OPP-2026-0002', type: 'B2B / licitación', channel: 'Correo', siteId: 'lima', customerId: 'CLI-0002', customerName: 'Corporación Robles S.A.C.', products: 'Mobiliario para oficinas administrativas', executive: 'ejecutivo.b2b', status: 'Derivada', createdAt: '2026-10-03', attachments: ['bases-licitacion.pdf'], nextActivity: '2026-10-15', activities: [{ date: '2026-10-03', status: 'Derivada', note: 'Derivada a ejecutivo B2B' }] }
];

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  readonly opportunities = signal<Opportunity[]>(this.restore());

  create(data: Omit<Opportunity, 'id' | 'createdAt'>): Opportunity {
    const opportunity: Opportunity = {
      ...data,
      id: `OPP-${new Date().getFullYear()}-${String(this.opportunities().length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10), activities: [{ date: new Date().toISOString().slice(0, 10), status: data.status, note: 'Oportunidad registrada' }]
    };
    const updated = [opportunity, ...this.opportunities()];
    this.opportunities.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return opportunity;
  }

  update(id: string, changes: Partial<Omit<Opportunity, 'id' | 'createdAt'>>): Opportunity | undefined {
    const current = this.opportunities().find((opportunity) => opportunity.id === id);
    if (!current) return undefined;
    const nextStatus = changes.status && changes.status !== current.status ? changes.status : undefined;
    const updated = { ...current, ...changes, activities: nextStatus ? [...(current.activities ?? []), { date: new Date().toISOString().slice(0, 10), status: nextStatus, note: `Estado actualizado a ${nextStatus}` }] : current.activities };
    this.persist(this.opportunities().map((opportunity) => opportunity.id === id ? updated : opportunity));
    return updated;
  }

  updateStatus(id: string, status: OpportunityStatus, note = ''): Opportunity | undefined {
    return this.update(id, { status });
  }

  isExecutiveAuthorized(username: string, executive: string): boolean {
    if (username === 'jefatura.ventas' || username === 'gerencia.comercial') return true;
    return username === executive;
  }

  private persist(opportunities: Opportunity[]): void {
    this.opportunities.set(opportunities);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  }

  private restore(): Opportunity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as Opportunity[] : DEMO_OPPORTUNITIES;
      return Array.isArray(parsed) && parsed.every((opportunity) => opportunity && typeof opportunity.id === 'string' && typeof opportunity.customerId === 'string') ? parsed : DEMO_OPPORTUNITIES;
    } catch { return DEMO_OPPORTUNITIES; }
  }
}
