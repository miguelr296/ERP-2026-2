import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLE_DEFINITIONS } from '../../core/data/roles.data';
import { RoleDefinition } from '../../core/models/access.model';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly roles = ROLE_DEFINITIONS;
  readonly selectedRoleId = signal('showroom-advisor');
  readonly selectedRole = computed(() => this.roles.find((role) => role.id === this.selectedRoleId()) ?? this.roles[0]);
  username = this.selectedRole().demoUser;
  password = 'demo';
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  chooseRole(role: RoleDefinition): void {
    this.selectedRoleId.set(role.id);
    this.username = role.demoUser;
    this.errorMessage.set('');
  }

  submit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('Completa el usuario y la contraseña de demostración.');
      return;
    }

    this.isSubmitting.set(true);
    this.auth.login(this.selectedRole(), this.username.trim());
    void this.router.navigateByUrl('/dashboard');
  }
}
