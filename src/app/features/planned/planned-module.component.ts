import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { findMenuItem, permissionForMenuCode } from '../../core/data/menu.data';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-planned-module',
  imports: [RouterLink, IconComponent],
  template: `
    <section class="planned-page">
      @if (menu(); as selected) {
        <div class="planned-icon"><app-icon [name]="selected.subsystem.icon"></app-icon></div>
        <p class="eyebrow">{{ selected.system.shortLabel }} · {{ selected.item.code }}</p>
        <h1>{{ selected.item.label }}</h1>
        <p class="module-path">{{ selected.system.label }} <app-icon name="angle-right"></app-icon> {{ selected.subsystem.label }} <app-icon name="angle-right"></app-icon> {{ selected.item.module }} <app-icon name="angle-right"></app-icon> {{ selected.item.option }}</p>
        <div class="planned-message"><app-icon name="wrench"></app-icon><div><strong>Módulo planificado</strong><p>Esta opción está trazada en el ERP, pero su funcionalidad será implementada en el sprint correspondiente.</p></div><span> {{ permissionLabel() }}</span></div>
        <a routerLink="/dashboard" class="secondary-button">Volver al inicio</a>
      } @else {
        <h1>Opción no encontrada</h1><a routerLink="/dashboard" class="secondary-button">Volver al inicio</a>
      }
    </section>
  `,
  styles: [`
    .planned-page { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
    .planned-icon { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 16px; background: #e8f0ff; color: #2864d7; margin-bottom: 20px; }
    h1 { margin: 8px 0; color: #16213d; }
    .module-path { color: #68738c; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .planned-message { display: flex; gap: 14px; align-items: flex-start; margin: 32px 0; padding: 20px; border: 1px solid #dce4f2; border-radius: 16px; background: #fff; color: #526079; }
    .planned-message strong { color: #16213d; display: block; margin-bottom: 6px; }
    .planned-message p { margin: 0; }
    .planned-message > span { margin-left: auto; white-space: nowrap; color: #2864d7; font-weight: 700; font-size: 12px; }
  `]
})
export class PlannedModuleComponent {
  private readonly route = inject(ActivatedRoute);
  readonly code = this.route.snapshot.queryParamMap.get('menu') ?? ['system', 'subsystem', 'module', 'option', 'suboption']
    .map((segment) => this.route.snapshot.paramMap.get(segment)).filter((segment): segment is string => Boolean(segment)).join('.');
  readonly menu = computed(() => findMenuItem(this.code));

  permissionLabel(): string {
    return `Permiso ${permissionForMenuCode(this.code)}`;
  }
}
