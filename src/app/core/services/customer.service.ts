import { Injectable, signal } from '@angular/core';
import { Customer, CustomerStatus } from '../models/customer.model';

const STORAGE_KEY = 'famihogar.erp.customers';

const DEMO_CUSTOMERS: Customer[] = [
  { id: 'CLI-0001', documentType: 'DNI', documentNumber: '45872136', customerType: 'Persona', name: 'María Fernanda Salazar', email: 'maria.salazar@email.com', phone: '987654321', address: 'Av. La Marina 1240, San Miguel', createdAt: '2026-09-18', siteId: 'lima', status: 'Activo', purchases: [{ id: 'PED-0001', date: '2026-09-25', description: 'Sofá modular Oslo', amount: 2890, status: 'Entregado' }] },
  { id: 'CLI-0002', documentType: 'RUC', documentNumber: '20604578125', customerType: 'Empresa', name: 'Corporación Robles S.A.C.', email: 'compras@corporacionrobles.pe', phone: '016421880', address: 'Jr. Los Cedros 450, Miraflores', createdAt: '2026-09-21', siteId: 'lima', status: 'Activo', creditLimit: 50000, documents: [{ name: 'ficha-ruc.pdf', type: 'Legal', uploadedAt: '2026-09-21' }] },
  { id: 'CLI-0003', documentType: 'DNI', documentNumber: '70431852', customerType: 'Persona', name: 'Jorge Luis Paredes', email: 'jorge.paredes@email.com', phone: '965741208', address: 'Calle San Martín 315, Arequipa', createdAt: '2026-09-27', siteId: 'arequipa', status: 'Activo' }
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
  readonly customers = signal<Customer[]>(this.restore());

  search(term: string, type: 'Todos' | 'DNI' | 'RUC' = 'Todos'): Customer[] {
    const normalized = term.trim().toLowerCase();
    return this.customers().filter((customer) => {
      const matchesType = type === 'Todos' || customer.documentType === type;
      const matchesTerm = !normalized || [customer.documentNumber, customer.name, customer.email, customer.phone]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesType && matchesTerm;
    });
  }

  exists(documentNumber: string, excludeId?: string): boolean {
    return this.customers().some((customer) => customer.documentNumber === documentNumber && customer.id !== excludeId);
  }

  create(data: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const customer: Customer = { ...data, id: `CLI-${String(this.customers().length + 1).padStart(4, '0')}`, createdAt: new Date().toISOString().slice(0, 10), status: data.status ?? 'Activo' };
    const updated = [customer, ...this.customers()];
    this.customers.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return customer;
  }

  update(id: string, changes: Partial<Omit<Customer, 'id' | 'createdAt'>>): Customer | undefined {
    const current = this.customers().find((customer) => customer.id === id);
    if (!current) return undefined;
    const updatedCustomer = { ...current, ...changes };
    this.persist(this.customers().map((customer) => customer.id === id ? updatedCustomer : customer));
    return updatedCustomer;
  }

  setStatus(id: string, status: CustomerStatus): boolean {
    return Boolean(this.update(id, { status }));
  }

  private persist(customers: Customer[]): void {
    this.customers.set(customers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }

  private restore(): Customer[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as Customer[] : DEMO_CUSTOMERS;
      return Array.isArray(parsed) && parsed.every((customer) => customer && typeof customer.id === 'string' && typeof customer.documentNumber === 'string')
        ? parsed.map((customer) => ({ ...customer, status: customer.status ?? 'Activo' }))
        : DEMO_CUSTOMERS;
    } catch { return DEMO_CUSTOMERS; }
  }
}
