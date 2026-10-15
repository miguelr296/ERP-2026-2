import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { accessGuard, authGuard } from './guards/auth.guard';
import { MENU_SYSTEMS, permissionForMenuCode, visibleMenuFor } from './data/menu.data';
import { ROLE_DEFINITIONS } from './data/roles.data';
import { AuthService } from './services/auth.service';
import { WorkspaceService } from './services/workspace.service';
import { routes } from '../app.routes';

const snapshot = (data: Record<string, unknown> = {}, queryCode: string | null = null) => ({
  data,
  queryParamMap: { get: (key: string) => key === 'menu' ? queryCode : null },
  paramMap: { get: () => null }
}) as never;

describe('Sprint 1 foundation', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('contains 18 roles and 49 traced menu options', () => {
    const menuItems = MENU_SYSTEMS.flatMap((system) => system.subsystems.flatMap((subsystem) => subsystem.items));
    expect(ROLE_DEFINITIONS).toHaveLength(18);
    expect(menuItems).toHaveLength(49);
    expect(menuItems.every((item) => ['C', 'R', 'A', 'P'].includes(item.permission))).toBe(true);
  });

  it('filters menu items by operation permission, not only subsystem', () => {
    const visible = visibleMenuFor({ CRM: 'C' });
    const items = visible.flatMap((system) => system.subsystems.flatMap((subsystem) => subsystem.items));
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.permission === 'C')).toBe(true);
    expect(items.some((item) => item.code === 'COM.01.1.1.1')).toBe(false);
    expect(items.some((item) => item.code === 'COM.01.1.2.1')).toBe(true);
  });

  it('maps menu operations to the matrix permission semantics', () => {
    expect(permissionForMenuCode('COM.01.1.1.1')).toBe('R');
    expect(permissionForMenuCode('COM.01.1.2.1')).toBe('C');
    expect(permissionForMenuCode('COM.02.3.1.1')).toBe('A');
    expect(permissionForMenuCode('COM.06.1.1.1')).toBe('P');
  });

  it('persists, restores and clears the simulated session', () => {
    const first = new AuthService();
    const role = ROLE_DEFINITIONS[0];
    first.login(role, role.demoUser);
    const restored = new AuthService();
    expect(restored.currentUser()?.roleId).toBe(role.id);
    expect(restored.currentUser()?.username).toBe(role.demoUser);
    restored.logout();
    expect(restored.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('famihogar.erp.session')).toBeNull();
  });

  it('persists and restores the active site', () => {
    const first = new WorkspaceService();
    first.setSite('arequipa');
    expect(first.activeSite()).toBe('arequipa');
    expect(new WorkspaceService().activeSite()).toBe('arequipa');
    first.setSite('unknown');
    expect(first.activeSite()).toBe('arequipa');
  });

  it('ignores a corrupted session and an invalid stored site', () => {
    localStorage.setItem('famihogar.erp.session', '{invalid');
    localStorage.setItem('famihogar.erp.site', 'unknown');
    expect(new AuthService().isAuthenticated()).toBe(false);
    expect(new WorkspaceService().activeSite()).toBe('lima');
  });

  it('redirects unauthenticated users to login', () => {
    const parseUrl = (url: string) => url;
    TestBed.configureTestingModule({ providers: [AuthService, { provide: Router, useValue: { parseUrl } }] });
    expect(TestBed.runInInjectionContext(() => authGuard(snapshot(), {} as never))).toBe('/login');
  });

  it('blocks an operation when the role lacks its C/R/A/P permission', () => {
    const auth = new AuthService();
    auth.login(ROLE_DEFINITIONS.find((role) => role.id === 'showroom-advisor')!, 'asesor.showroom');
    const parseUrl = (url: string) => url;
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: { parseUrl } }] });
    expect(TestBed.runInInjectionContext(() => accessGuard(snapshot({}, 'COM.02.3.1.1'), {} as never))).toBe('/dashboard');
  });

  it('has a hierarchical placeholder route for all traced but unimplemented options', () => {
    const children = routes.find((route) => route.path === '')?.children ?? [];
    expect(children.some((route) => route.path === 'planned/:system/:subsystem/:module/:option/:suboption')).toBe(true);
  });
});
