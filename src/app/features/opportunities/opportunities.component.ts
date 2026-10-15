import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { OpportunityService } from '../../core/services/opportunity.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-opportunities',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, TitleCasePipe],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.scss'
})
export class OpportunitiesComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly opportunityService = inject(OpportunityService);
  readonly customerService = inject(CustomerService);
  readonly auth = inject(AuthService);
  readonly workspace = inject(WorkspaceService);
  readonly showForm = signal(false);
  readonly view = signal<'normal' | 'attachments' | 'tracking'>('normal');
  readonly feedback = signal('');
  readonly filter = signal<'Todas' | 'Retail' | 'B2B / licitación'>('Todas');
  readonly canCreate = computed(() => this.auth.can('CRM', 'C'));
  readonly selectedFiles = signal<string[]>([]);

  readonly executives = ['asesor.showroom', 'ejecutivo.b2b', 'jefatura.ventas'];
  readonly form = this.formBuilder.nonNullable.group({
    type: ['Retail' as 'Retail' | 'B2B / licitación', Validators.required],
    channel: ['Showroom' as 'Showroom' | 'Correo' | 'Llamada' | 'Licitación', Validators.required],
    customerId: ['', Validators.required],
    products: ['', [Validators.required, Validators.minLength(5)]],
    executive: ['asesor.showroom', Validators.required]
    ,nextActivity: ['']
  });
  readonly visibleOpportunities = computed(() => this.opportunityService.opportunities().filter((item) => this.filter() === 'Todas' || item.type === this.filter()));

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      this.view.set(view === 'attachments' || view === 'tracking' ? view : 'normal');
      if (!params.has('type')) return;
      const type = params.get('type') === 'b2b' ? 'B2B / licitación' : 'Retail';
      this.filter.set(type);
      this.openForm(type);
    });
  }

  openForm(type: 'Retail' | 'B2B / licitación' = 'Retail'): void {
    if (!this.canCreate()) return;
    this.feedback.set('');
    this.selectedFiles.set([]);
    this.form.reset({ type, channel: type === 'Retail' ? 'Showroom' : 'Correo', customerId: '', products: '', executive: type === 'Retail' ? 'asesor.showroom' : 'ejecutivo.b2b', nextActivity: '' });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }
  selectFiles(event: Event): void { this.selectedFiles.set(Array.from((event.target as HTMLInputElement).files ?? []).map((file) => file.name)); }
  setFilter(filter: 'Todas' | 'Retail' | 'B2B / licitación'): void { this.filter.set(filter); }

  advance(opportunity: ReturnType<OpportunityService['opportunities']>[number]): void {
    if (!this.canCreate()) return;
    const next = opportunity.status === 'Nueva' ? 'En evaluación' : opportunity.status === 'En evaluación' ? 'Derivada' : opportunity.status === 'Derivada' ? 'Ganada' : undefined;
    if (next) this.opportunityService.updateStatus(opportunity.id, next);
  }

  save(): void {
    if (!this.canCreate()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); this.feedback.set('Completa todos los campos para registrar la oportunidad.'); return; }
    const value = this.form.getRawValue();
    const customer = this.customerService.customers().find((item) => item.id === value.customerId);
    if (!customer) { this.feedback.set('Selecciona un cliente existente para asociar la oportunidad.'); return; }
    if (!this.opportunityService.isExecutiveAuthorized(this.auth.currentUser()?.username ?? '', value.executive)) { this.feedback.set('El ejecutivo seleccionado no está autorizado para el rol activo.'); return; }
    if (value.nextActivity && value.nextActivity < new Date().toISOString().slice(0, 10)) { this.feedback.set('La próxima actividad debe ser una fecha futura.'); return; }
    const opportunity = this.opportunityService.create({
      type: value.type, channel: value.channel, siteId: this.workspace.activeSite(), customerId: customer.id,
      customerName: customer.name, products: value.products, executive: value.executive,
      status: 'Derivada', attachments: this.selectedFiles(), nextActivity: value.nextActivity
    });
    this.showForm.set(false);
    this.feedback.set(`${opportunity.id} registrada y derivada a ${opportunity.executive}.`);
  }
}
