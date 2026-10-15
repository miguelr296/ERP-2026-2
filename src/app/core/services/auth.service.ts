import { Injectable, computed, signal } from '@angular/core';
import { getRoleById, ROLE_DEFINITIONS } from '../data/roles.data';
import { hasPermission } from '../data/menu.data';
import { Permission, RoleDefinition, SessionUser, SubsystemId } from '../models/access.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'famihogar.erp.session';
  readonly currentUser = signal<SessionUser | null>(this.restoreSession());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(role: RoleDefinition, username: string): void {
    const session: SessionUser = {
      roleId: role.id,
      roleName: role.name,
      username,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.currentUser.set(session);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  role(): RoleDefinition | undefined {
    return getRoleById(this.currentUser()?.roleId);
  }

  can(subsystem: SubsystemId, permission: Permission): boolean {
    return hasPermission(this.role()?.permissions[subsystem], permission);
  }

  availableRoles(): RoleDefinition[] {
    return ROLE_DEFINITIONS;
  }

  private restoreSession(): SessionUser | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const session = JSON.parse(raw) as Partial<SessionUser>;
      return session.roleId && getRoleById(session.roleId) && typeof session.username === 'string' && typeof session.loginAt === 'string'
        ? session as SessionUser
        : null;
    } catch {
      return null;
    }
  }
}
