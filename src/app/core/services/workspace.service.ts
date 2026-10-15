import { Injectable, signal } from '@angular/core';

export interface SiteOption {
  id: string;
  label: string;
  detail: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  readonly sites: SiteOption[] = [
    { id: 'lima', label: 'Lima', detail: 'Showroom Lima' },
    { id: 'arequipa', label: 'Arequipa', detail: 'Sucursal Sur' },
    { id: 'trujillo', label: 'Trujillo', detail: 'Sucursal Norte' },
    { id: 'cedi', label: 'CEDI Central', detail: 'Almacén central' }
  ];
  readonly activeSite = signal(this.restoreSite());

  setSite(siteId: string): void {
    if (!this.sites.some((site) => site.id === siteId)) return;
    localStorage.setItem('famihogar.erp.site', siteId);
    this.activeSite.set(siteId);
  }

  currentSite(): SiteOption {
    return this.sites.find((site) => site.id === this.activeSite()) ?? this.sites[0];
  }

  private restoreSite(): string {
    const stored = localStorage.getItem('famihogar.erp.site');
    return stored && this.sites.some((site) => site.id === stored) ? stored : 'lima';
  }
}
