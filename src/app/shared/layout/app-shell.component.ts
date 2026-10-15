import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { getRoleById } from '../../core/data/roles.data';
import { visibleMenuFor } from '../../core/data/menu.data';
import { AuthService } from '../../core/services/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  readonly auth = inject(AuthService);
  readonly workspace = inject(WorkspaceService);
  private readonly router = inject(Router);
  readonly sidebarOpen = signal(false);
  readonly currentUser = this.auth.currentUser;
  readonly currentRole = computed(() => getRoleById(this.currentUser()?.roleId));
  readonly visibleSystems = computed(() => visibleMenuFor(this.currentRole()?.permissions ?? {}));

  currentSite() {
    return this.workspace.currentSite();
  }

  setSite(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.workspace.setSite(select.value);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  initials(name: string | undefined): string {
    if (!name) return 'FH';
    return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
  }

  menuRoute(code: string): string[] {
    if (code.startsWith('COM.01.1.')) return ['/customers'];
    if (code.startsWith('COM.01.2.')) return ['/opportunities'];
    if (code.startsWith('COM.01.3.')) return ['/availability'];
    if (code === 'COM.01.4.1.1' || code === 'COM.01.4.2.1') return ['/costing'];
    if (code === 'ING.01.1.1.1' || code === 'ING.01.1.2.1') return ['/engineering/costing'];
    return ['/planned', ...code.split('.')];
  }

  menuQuery(code: string): Record<string, string> {
    const queries: Record<string, Record<string, string>> = {
      'COM.01.1.1.1': { view: 'new' },
      'COM.01.1.2.1': { view: 'search' },
      'COM.01.1.2.2': { view: 'history' },
      'COM.01.1.3.1': { view: 'b2b' },
      'COM.01.2.1.1': { type: 'retail' },
      'COM.01.2.1.2': { type: 'b2b' },
      'COM.01.2.1.3': { view: 'attachments' },
      'COM.01.2.2.1': { view: 'tracking' },
      'COM.01.3.1.1': { view: 'catalog' },
      'COM.01.3.2.1': { view: 'stock' },
      'COM.01.3.2.2': { view: 'transfer' },
      'COM.01.4.1.1': { view: 'create' },
      'COM.01.4.2.1': { view: 'tracking' },
      'ING.01.1.1.1': { view: 'inbox' },
      'ING.01.1.2.1': { view: 'cost-sheet' }
    };
    return { menu: code, ...(queries[code] ?? {}) };
  }
}
