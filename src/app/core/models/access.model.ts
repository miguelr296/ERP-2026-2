export type Permission = 'C' | 'R' | 'A' | 'P';

export type SubsystemId =
  | 'CRM'
  | 'PRICING'
  | 'CREDIT'
  | 'ORDERS'
  | 'REPORTS'
  | 'SECURITY'
  | 'ING'
  | 'PRO'
  | 'FIN'
  | 'LOG';

export interface RoleDefinition {
  id: string;
  name: string;
  area: string;
  demoUser: string;
  permissions: Partial<Record<SubsystemId, string>>;
}

export interface MenuItem {
  code: string;
  label: string;
  module: string;
  option: string;
  permission: Permission;
}

export interface MenuSubsystem {
  id: SubsystemId;
  label: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuSystem {
  id: string;
  label: string;
  shortLabel: string;
  accent: string;
  subsystems: MenuSubsystem[];
}

export interface SessionUser {
  roleId: string;
  roleName: string;
  username: string;
  loginAt: string;
}
