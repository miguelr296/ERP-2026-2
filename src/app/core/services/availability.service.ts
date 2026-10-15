import { Injectable, signal } from '@angular/core';
import { CatalogProduct, SiteStock, StockMovement } from '../models/catalog.model';

const STOCK_KEY = 'famihogar.erp.stock';
const MOVEMENTS_KEY = 'famihogar.erp.stock-movements';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  readonly products: CatalogProduct[] = [
    { sku: 'FH-SOF-001', name: 'Sofá modular Oslo 3 cuerpos', category: 'Sala', unit: 'unidad', price: 2890, accent: 'teal' },
    { sku: 'FH-COM-014', name: 'Comedor Nórdico 6 sillas', category: 'Comedor', unit: 'set', price: 3190, accent: 'orange' },
    { sku: 'FH-DOR-008', name: 'Cama King Álamo', category: 'Dormitorio', unit: 'unidad', price: 2450, accent: 'blue' },
    { sku: 'FH-OFI-022', name: 'Escritorio Ejecutivo Roble', category: 'Oficina', unit: 'unidad', price: 1290, accent: 'purple' },
    { sku: 'FH-SOF-019', name: 'Sillón reclinable Confort', category: 'Sala', unit: 'unidad', price: 1590, accent: 'teal' },
    { sku: 'FH-EST-031', name: 'Estante alto Viena', category: 'Complementos', unit: 'unidad', price: 890, accent: 'orange' }
  ];

  private readonly demoStock: SiteStock[] = [
    { sku: 'FH-SOF-001', siteId: 'lima', physical: 12, reserved: 3 }, { sku: 'FH-SOF-001', siteId: 'arequipa', physical: 5, reserved: 1 }, { sku: 'FH-SOF-001', siteId: 'trujillo', physical: 0, reserved: 0 }, { sku: 'FH-SOF-001', siteId: 'cedi', physical: 24, reserved: 8 },
    { sku: 'FH-COM-014', siteId: 'lima', physical: 7, reserved: 2 }, { sku: 'FH-COM-014', siteId: 'arequipa', physical: 2, reserved: 0 }, { sku: 'FH-COM-014', siteId: 'trujillo', physical: 4, reserved: 1 }, { sku: 'FH-COM-014', siteId: 'cedi', physical: 10, reserved: 2 },
    { sku: 'FH-DOR-008', siteId: 'lima', physical: 3, reserved: 3 }, { sku: 'FH-DOR-008', siteId: 'arequipa', physical: 1, reserved: 0 }, { sku: 'FH-DOR-008', siteId: 'trujillo', physical: 0, reserved: 0 }, { sku: 'FH-DOR-008', siteId: 'cedi', physical: 8, reserved: 2 },
    { sku: 'FH-OFI-022', siteId: 'lima', physical: 9, reserved: 2 }, { sku: 'FH-OFI-022', siteId: 'arequipa', physical: 3, reserved: 1 }, { sku: 'FH-OFI-022', siteId: 'trujillo', physical: 6, reserved: 0 }, { sku: 'FH-OFI-022', siteId: 'cedi', physical: 15, reserved: 4 },
    { sku: 'FH-SOF-019', siteId: 'lima', physical: 4, reserved: 1 }, { sku: 'FH-SOF-019', siteId: 'arequipa', physical: 0, reserved: 0 }, { sku: 'FH-SOF-019', siteId: 'trujillo', physical: 2, reserved: 0 }, { sku: 'FH-SOF-019', siteId: 'cedi', physical: 7, reserved: 1 },
    { sku: 'FH-EST-031', siteId: 'lima', physical: 10, reserved: 0 }, { sku: 'FH-EST-031', siteId: 'arequipa', physical: 4, reserved: 1 }, { sku: 'FH-EST-031', siteId: 'trujillo', physical: 3, reserved: 0 }, { sku: 'FH-EST-031', siteId: 'cedi', physical: 12, reserved: 2 }
  ];
  readonly stock = signal<SiteStock[]>(this.restoreStock());
  readonly movements = signal<StockMovement[]>(this.restoreMovements());

  stockFor(sku: string, siteId: string): SiteStock {
    return this.stock().find((item) => item.sku === sku && item.siteId === siteId) ?? { sku, siteId, physical: 0, reserved: 0 };
  }

  availableFor(sku: string, siteId: string): number {
    const item = this.stockFor(sku, siteId);
    return Math.max(item.physical - item.reserved, 0);
  }

  reserve(sku: string, siteId: string, quantity: number): boolean {
    if (!Number.isInteger(quantity) || quantity <= 0 || this.availableFor(sku, siteId) < quantity) return false;
    this.updateStock(sku, siteId, (stock) => ({ ...stock, reserved: stock.reserved + quantity }));
    this.record({ sku, siteId, type: 'Reserva', quantity });
    return true;
  }

  release(sku: string, siteId: string, quantity: number): boolean {
    const stock = this.stockFor(sku, siteId);
    if (!Number.isInteger(quantity) || quantity <= 0 || stock.reserved < quantity) return false;
    this.updateStock(sku, siteId, (current) => ({ ...current, reserved: current.reserved - quantity }));
    this.record({ sku, siteId, type: 'Liberación', quantity });
    return true;
  }

  transfer(sku: string, fromSite: string, toSite: string, quantity: number): boolean {
    if (fromSite === toSite || !Number.isInteger(quantity) || quantity <= 0 || this.availableFor(sku, fromSite) < quantity) return false;
    this.updateStock(sku, fromSite, (stock) => ({ ...stock, physical: stock.physical - quantity }));
    this.updateStock(sku, toSite, (stock) => ({ ...stock, physical: stock.physical + quantity }));
    this.record({ sku, siteId: fromSite, toSite, fromSite, type: 'Traslado', quantity });
    return true;
  }

  replenish(sku: string, siteId: string, quantity: number): boolean {
    if (!Number.isInteger(quantity) || quantity <= 0) return false;
    this.updateStock(sku, siteId, (stock) => ({ ...stock, physical: stock.physical + quantity }));
    this.record({ sku, siteId, type: 'Reposición', quantity });
    return true;
  }

  private updateStock(sku: string, siteId: string, update: (stock: SiteStock) => SiteStock): void {
    const current = this.stockFor(sku, siteId);
    const updated = this.stock().some((stock) => stock.sku === sku && stock.siteId === siteId)
      ? this.stock().map((stock) => stock.sku === sku && stock.siteId === siteId ? update(stock) : stock)
      : [...this.stock(), update(current)];
    this.stock.set(updated);
    localStorage.setItem(STOCK_KEY, JSON.stringify(updated));
  }

  private record(data: Omit<StockMovement, 'id' | 'createdAt'>): void {
    const movement = { ...data, id: `MOV-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [movement, ...this.movements()];
    this.movements.set(updated);
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updated));
  }

  private restoreStock(): SiteStock[] {
    try {
      const raw = localStorage.getItem(STOCK_KEY);
      const parsed = raw ? JSON.parse(raw) as SiteStock[] : this.demoStock;
      return Array.isArray(parsed) && parsed.every((stock) => stock && typeof stock.sku === 'string' && stock.physical >= 0 && stock.reserved >= 0) ? parsed : this.demoStock;
    } catch { return this.demoStock; }
  }

  private restoreMovements(): StockMovement[] {
    try {
      const raw = localStorage.getItem(MOVEMENTS_KEY);
      const parsed = raw ? JSON.parse(raw) as StockMovement[] : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
}
