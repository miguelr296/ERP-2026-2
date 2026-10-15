import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerDocumentType } from '../../core/models/customer.model';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { peruvianDniValidator, peruvianRucValidator } from '../../core/validators/document.validators';

@Component({
  selector: 'app-customers',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, TitleCasePipe, DecimalPipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly customerService = inject(CustomerService);
  readonly auth = inject(AuthService);
  readonly workspace = inject(WorkspaceService);
  readonly searchTerm = signal('');
  readonly documentFilter = signal<'Todos' | 'DNI' | 'RUC'>('Todos');
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly view = signal<'search' | 'new' | 'history' | 'b2b'>('search');
  readonly feedback = signal('');
  readonly feedbackType = signal<'success' | 'error'>('success');
  readonly canCreate = computed(() => this.auth.can('CRM', 'C'));

  readonly customerForm = this.formBuilder.nonNullable.group({
    documentType: ['DNI' as CustomerDocumentType, Validators.required],
    documentNumber: ['', [Validators.required, peruvianDniValidator()]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{7,9}$/)]],
    address: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly filteredCustomers = computed(() => this.customerService.search(this.searchTerm(), this.documentFilter()));

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      this.view.set(view === 'history' || view === 'b2b' || view === 'new' ? view : 'search');
      if (view === 'new') this.openForm();
    });
    this.customerForm.controls.documentType.valueChanges.subscribe((type) => {
      const control = this.customerForm.controls.documentNumber;
      control.setValidators([Validators.required, type === 'DNI' ? peruvianDniValidator() : peruvianRucValidator()]);
      control.reset('');
    });
  }

  openForm(): void {
    if (!this.canCreate()) return;
    this.feedback.set('');
    this.editingId.set(null);
    this.customerForm.reset({ documentType: 'DNI', documentNumber: '', name: '', email: '', phone: '', address: '' });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  openEdit(customer: ReturnType<CustomerService['customers']>[number]): void {
    if (!this.canCreate()) return;
    this.editingId.set(customer.id);
    this.customerForm.reset({ documentType: customer.documentType, documentNumber: customer.documentNumber, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    this.showForm.set(true);
  }

  toggleStatus(customer: ReturnType<CustomerService['customers']>[number]): void {
    if (!this.canCreate()) return;
    const status = customer.status === 'Inactivo' ? 'Activo' : 'Inactivo';
    this.customerService.setStatus(customer.id, status);
    this.feedback.set(`${customer.name} ahora está ${status.toLowerCase()}.`);
  }

  updateSearch(event: Event): void { this.searchTerm.set((event.target as HTMLInputElement).value); }

  setDocumentFilter(type: 'Todos' | 'DNI' | 'RUC'): void { this.documentFilter.set(type); }

  saveCustomer(): void {
    if (!this.canCreate()) return;
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.feedbackType.set('error');
      this.feedback.set('Revisa los campos obligatorios y el formato del documento.');
      return;
    }
    const value = this.customerForm.getRawValue();
    if (this.customerService.exists(value.documentNumber, this.editingId() ?? undefined)) {
      this.feedbackType.set('error');
      this.feedback.set(`El ${value.documentType} ${value.documentNumber} ya está registrado.`);
      return;
    }
    const wasEditing = Boolean(this.editingId());
    const customer = this.editingId()
      ? this.customerService.update(this.editingId()!, { ...value, customerType: value.documentType === 'DNI' ? 'Persona' : 'Empresa' })
      : this.customerService.create({ documentType: value.documentType, documentNumber: value.documentNumber, customerType: value.documentType === 'DNI' ? 'Persona' : 'Empresa', name: value.name, email: value.email, phone: value.phone, address: value.address, siteId: this.workspace.activeSite() });
    if (!customer) return;
    this.searchTerm.set(customer.documentNumber);
    this.showForm.set(false);
    this.feedbackType.set('success');
    this.editingId.set(null);
    this.feedback.set(`Cliente ${customer.name} ${wasEditing ? 'actualizado' : 'registrado'} correctamente.`);
  }

  controlError(controlName: keyof typeof this.customerForm.controls): boolean {
    const control = this.customerForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
