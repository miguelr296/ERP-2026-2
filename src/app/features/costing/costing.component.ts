import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CostingService } from '../../core/services/costing.service';
import { CustomerService } from '../../core/services/customer.service';
import { OpportunityService } from '../../core/services/opportunity.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-costing',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, DatePipe],
  templateUrl: './costing.component.html',
  styleUrl: './costing.component.scss'
})
export class CostingComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly costing = inject(CostingService);
  readonly customers = inject(CustomerService);
  readonly opportunities = inject(OpportunityService);
  readonly workspace = inject(WorkspaceService);
  readonly auth = inject(AuthService);
  readonly route = inject(ActivatedRoute);
  readonly isEngineering = this.route.snapshot.data['mode'] === 'engineering';
  readonly showForm = signal(false);
  readonly view = signal<'create' | 'tracking' | 'inbox' | 'cost-sheet' | ''>('');
  readonly canCreate = computed(() => this.auth.can('CRM', 'C'));
  readonly canAdvance = computed(() => this.isEngineering && this.auth.can('ING', 'C'));
  readonly feedback = signal('');
  readonly filter = signal<'Todas' | 'Recibida' | 'En diseño' | 'Costeada'>('Todas');
  readonly selectedFiles = signal<string[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    customerId: ['', Validators.required], opportunityId: [''], projectName: ['', [Validators.required, Validators.minLength(5)]], description: ['', [Validators.required, Validators.minLength(12)]], commitmentDate: ['', Validators.required]
  });
  readonly visibleRequests = computed(() => this.costing.requests().filter((request) => this.filter() === 'Todas' || request.status === this.filter()));
  readonly activeAlerts = computed(() => this.costing.requests().filter((request) => this.costing.isOverdue(request) || this.costing.isNearDue(request)).length);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      this.view.set(view === 'create' || view === 'tracking' || view === 'inbox' || view === 'cost-sheet' ? view : '');
      if (view === 'create' && !this.isEngineering) this.openForm();
    });
  }

  openForm(): void { if (!this.canCreate()) return; this.feedback.set(''); this.selectedFiles.set([]); this.form.reset({ customerId: '', opportunityId: '', projectName: '', description: '', commitmentDate: '' }); this.showForm.set(true); }
  closeForm(): void { this.showForm.set(false); }
  setFilter(filter: 'Todas' | 'Recibida' | 'En diseño' | 'Costeada'): void { this.filter.set(filter); }

  selectFiles(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    const valid = files.filter((file) => /\.(pdf|png|jpe?g|dwg|dxf)$/i.test(file.name) && file.size <= 10 * 1024 * 1024);
    this.selectedFiles.set(valid.map((file) => file.name));
    if (valid.length !== files.length) this.feedback.set('Cada adjunto debe ser PDF, imagen o CAD y no superar 10 MB.');
  }

  save(): void {
    if (!this.canCreate()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); this.feedback.set('Completa los datos del proyecto y la fecha compromiso.'); return; }
    const value = this.form.getRawValue();
    const customer = this.customers.customers().find((item) => item.id === value.customerId);
    if (!customer) { this.feedback.set('Selecciona un cliente válido.'); return; }
    const opportunity = value.opportunityId ? this.opportunities.opportunities().find((item) => item.id === value.opportunityId) : undefined;
    if (value.opportunityId && (!opportunity || opportunity.customerId !== customer.id)) { this.feedback.set('La oportunidad seleccionada no pertenece al cliente indicado.'); return; }
    if (!this.costing.isFutureDate(value.commitmentDate)) { this.feedback.set('La fecha compromiso debe ser hoy o una fecha futura.'); return; }
    const request = this.costing.create({ customerId: customer.id, customerName: customer.name, opportunityId: value.opportunityId, projectName: value.projectName, description: value.description, commitmentDate: value.commitmentDate, attachments: this.selectedFiles(), requester: this.auth.currentUser()?.username ?? 'usuario.demo', siteId: this.workspace.activeSite() });
    this.showForm.set(false); this.feedback.set(`${request.id} enviada a Oficina Técnica con fecha compromiso ${request.commitmentDate}.`);
  }

  advance(requestId: string, status: 'En diseño' | 'Costeada'): void { if (this.canAdvance()) this.costing.updateStatus(requestId, status); }
  alertText(request: ReturnType<CostingService['requests']>[number]): string { return this.costing.isOverdue(request) ? 'Vencida' : this.costing.isNearDue(request) ? 'Próxima' : ''; }
}
