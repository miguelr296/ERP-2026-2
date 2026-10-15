import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AvailabilityService } from '../../core/services/availability.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-availability',
  imports: [RouterLink, IconComponent, CurrencyPipe],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss'
})
export class AvailabilityComponent {
  readonly availability = inject(AvailabilityService);
  private readonly route = inject(ActivatedRoute);
  readonly workspace = inject(WorkspaceService);
  readonly view = signal<'catalog' | 'stock' | 'transfer'>('catalog');
  readonly transferSku = signal('FH-SOF-001');
  readonly transferFrom = signal('lima');
  readonly transferTo = signal('arequipa');
  readonly transferQuantity = signal(1);
  readonly feedback = signal('');
  readonly searchTerm = signal('');
  readonly selectedSite = signal('active');

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      this.view.set(view === 'stock' || view === 'transfer' ? view : 'catalog');
    });
  }

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.availability.products.filter((product) => !term || [product.sku, product.name, product.category].some((value) => value.toLowerCase().includes(term)));
  });

  readonly stockRows = computed(() => this.filteredProducts().map((product) => {
    const siteId = this.selectedSite() === 'active' ? this.workspace.activeSite() : this.selectedSite();
    const stock = this.availability.stockFor(product.sku, siteId);
    return { product, stock, available: Math.max(stock.physical - stock.reserved, 0) };
  }));

  setView(view: 'catalog' | 'stock' | 'transfer'): void { this.view.set(view); this.feedback.set(''); }
  setSite(event: Event): void { this.selectedSite.set((event.target as HTMLSelectElement).value); }
  updateSearch(event: Event): void { this.searchTerm.set((event.target as HTMLInputElement).value); }
  currentSiteLabel(): string { return this.workspace.currentSite().label; }
  availabilityState(available: number): string { return available > 3 ? 'Disponible' : available > 0 ? 'Bajo stock' : 'Sin stock'; }
  transfer(): void {
    const ok = this.availability.transfer(this.transferSku(), this.transferFrom(), this.transferTo(), this.transferQuantity());
    this.feedback.set(ok ? 'Traslado registrado y stock actualizado en ambas sedes.' : 'No se pudo trasladar: verifica sedes, cantidad y stock disponible.');
  }
  reserve(): void { this.feedback.set(this.availability.reserve(this.transferSku(), this.transferFrom(), this.transferQuantity()) ? 'Reserva registrada.' : 'No se pudo reservar: cantidad inválida o stock insuficiente.'); }
  release(): void { this.feedback.set(this.availability.release(this.transferSku(), this.transferFrom(), this.transferQuantity()) ? 'Reserva liberada.' : 'No se pudo liberar: revisa la reserva existente.'); }
  replenish(): void { this.feedback.set(this.availability.replenish(this.transferSku(), this.transferTo(), this.transferQuantity()) ? 'Reposición registrada.' : 'La cantidad de reposición no es válida.'); }
}
