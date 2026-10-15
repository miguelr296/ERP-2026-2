import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { findMenuItem, hasPermission, permissionForMenuCode } from '../data/menu.data';
import { getRoleById } from '../data/roles.data';
import { Permission, SubsystemId } from '../models/access.model';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.parseUrl('/dashboard') : true;
};

export const subsystemGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const subsystem = route.data['subsystem'] as SubsystemId | undefined;
  const permissions = getRoleById(auth.currentUser()?.roleId)?.permissions ?? {};
  return subsystem && permissions[subsystem] && permissions[subsystem] !== '-'
    ? true
    : router.parseUrl('/dashboard');
};

export const accessGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const code = route.queryParamMap.get('menu') ?? route.paramMap.get('code') ?? ['system', 'subsystem', 'module', 'option', 'suboption']
    .map((segment) => route.paramMap.get(segment)).filter((segment): segment is string => Boolean(segment)).join('.');
  const menu = findMenuItem(code);
  const subsystem = (route.data['subsystem'] as SubsystemId | undefined) ?? menu?.subsystem.id;
  const required = code ? permissionForMenuCode(code) : route.data['permission'] as Permission | undefined;
  const permissions = getRoleById(auth.currentUser()?.roleId)?.permissions ?? {};

  return subsystem && (!required || hasPermission(permissions[subsystem], required))
    ? true
    : router.parseUrl('/dashboard');
};
