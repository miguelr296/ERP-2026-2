import { AvailabilityService } from './services/availability.service';
import { CustomerService } from './services/customer.service';
import { OpportunityService } from './services/opportunity.service';
import { CostingService } from './services/costing.service';
import { peruvianDniValidator, peruvianRucValidator } from './validators/document.validators';

describe('Sprint 2 core rules', () => {
  beforeEach(() => localStorage.clear());

  it('validates DNI format and RUC check digit', () => {
    expect(peruvianDniValidator()({ value: '45872136' } as never)).toBeNull();
    expect(peruvianDniValidator()({ value: '1234567' } as never)).toEqual({ dni: true });
    expect(peruvianRucValidator()({ value: '20604578125' } as never)).toBeNull();
    expect(peruvianRucValidator()({ value: '20604578129' } as never)).toEqual({ ruc: true });
  });

  it('searches clients by phone and persists a new client', () => {
    const service = new CustomerService();
    expect(service.search('987654321')).toHaveLength(1);
    service.create({ documentType: 'DNI', documentNumber: '11223344', customerType: 'Persona', name: 'Cliente de prueba', email: 'test@example.com', phone: '999888777', address: 'Dirección de prueba', siteId: 'lima' });
    expect(JSON.parse(localStorage.getItem('famihogar.erp.customers') ?? '[]')).toHaveLength(4);
  });

  it('calculates MTS available stock as physical minus reserved', () => {
    const service = new AvailabilityService();
    expect(service.availableFor('FH-SOF-001', 'lima')).toBe(9);
    expect(service.reserve('FH-SOF-001', 'lima', 2)).toBe(true);
    expect(service.availableFor('FH-SOF-001', 'lima')).toBe(7);
    expect(service.release('FH-SOF-001', 'lima', 2)).toBe(true);
    expect(service.transfer('FH-SOF-001', 'lima', 'arequipa', 1)).toBe(true);
    expect(service.transfer('FH-SOF-001', 'lima', 'lima', 1)).toBe(false);
    expect(service.reserve('FH-SOF-001', 'lima', -1)).toBe(false);
  });

  it('persists a derived opportunity with a unique code', () => {
    const service = new OpportunityService();
    const opportunity = service.create({ type: 'Retail', channel: 'Showroom', siteId: 'lima', customerId: 'CLI-0001', customerName: 'Cliente demo', products: 'Sofá', executive: 'asesor.showroom', status: 'Derivada' });
    expect(opportunity.id).toMatch(/^OPP-/);
    expect(JSON.parse(localStorage.getItem('famihogar.erp.opportunities') ?? '[]')[0].id).toBe(opportunity.id);
    expect(opportunity.activities?.length).toBe(1);
  });

  it('validates future commitment dates and restores corrupted costing data safely', () => {
    localStorage.setItem('famihogar.erp.costing-requests', '{invalid');
    const service = new CostingService();
    expect(service.requests().length).toBeGreaterThan(0);
    expect(service.isFutureDate('2020-01-01')).toBe(false);
    expect(service.isFutureDate('2099-01-01')).toBe(true);
  });
});
