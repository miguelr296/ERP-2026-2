import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { findMenuItem } from '../../core/data/menu.data';
import { getRoleById } from '../../core/data/roles.data';
import { AuthService } from '../../core/services/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  imports: [IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);
  readonly workspace = inject(WorkspaceService);
  readonly selectedCode = signal<string | null>(null);
  readonly currentUser = this.auth.currentUser;
  readonly currentRole = computed(() => getRoleById(this.currentUser()?.roleId));
  readonly greetingName = computed(() => this.currentRole()?.name.split(' ')[0] ?? 'equipo');
  readonly selectedMenu = computed(() => findMenuItem(this.selectedCode()));

  readonly foundationCards = [
    { icon: 'users', value: '18', label: 'roles del catálogo', note: 'Matriz v3' },
    { icon: 'file', value: '49', label: 'subopciones trazadas', note: 'Menú con estados explícitos' },
    { icon: 'check-circle', value: '57', label: 'requerimientos funcionales', note: 'Matriz PO.02' }
  ];

  readonly processes = [
    { code: 'PO.02.P01', title: 'Captura y disponibilidad', detail: 'CRM, oportunidades y stock por sede', accent: 'teal' },
    { code: 'PO.02.P02', title: 'Precios y cotizaciones', detail: 'Listas, descuentos y emisión', accent: 'blue' },
    { code: 'PO.02.P03', title: 'Crédito y pagos', detail: 'Conciliación y evaluación B2B', accent: 'purple' },
    { code: 'PO.02.P04', title: 'Nota de Pedido', detail: 'Reserva y distribución interna', accent: 'orange' }
  ];

  constructor() {
    this.route.queryParamMap.subscribe((params) => this.selectedCode.set(params.get('menu')));
  }

  currentSite() {
    return this.workspace.currentSite();
  }
}
