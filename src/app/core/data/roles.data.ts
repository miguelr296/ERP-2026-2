import { RoleDefinition } from '../models/access.model';

const commercial = {
  CRM: 'C,R',
  PRICING: 'C,R',
  CREDIT: 'C,R',
  ORDERS: 'C,R',
  REPORTS: 'C'
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'showroom-advisor',
    name: 'Asesor comercial (showroom)',
    area: 'Gerencia Comercial y Red de Sucursales',
    demoUser: 'asesor.showroom',
    permissions: { CRM: 'C,R', PRICING: 'C,R', CREDIT: 'C,R', ORDERS: 'C', REPORTS: 'C' }
  },
  {
    id: 'branch-admin',
    name: 'Administrador de sucursal (Lima / Sur / Norte)',
    area: 'Gerencia Comercial y Red de Sucursales',
    demoUser: 'admin.sucursal',
    permissions: commercial
  },
  {
    id: 'b2b-executive',
    name: 'Ejecutivo de ventas B2B',
    area: 'Jefatura Ventas Corporativas B2B',
    demoUser: 'ejecutivo.b2b',
    permissions: { ...commercial, PRO: 'C' }
  },
  {
    id: 'b2b-chief',
    name: 'Jefatura Ventas Corporativas B2B',
    area: 'Gerencia Comercial y Red de Sucursales',
    demoUser: 'jefatura.ventas',
    permissions: {
      CRM: 'C,R,A', PRICING: 'C,R,A', CREDIT: 'C', ORDERS: 'C,R,A', REPORTS: 'C',
      SECURITY: 'C,P', ING: 'C', PRO: 'C'
    }
  },
  {
    id: 'commercial-manager',
    name: 'Gerencia Comercial',
    area: 'Gerencia Comercial y Red de Sucursales',
    demoUser: 'gerencia.comercial',
    permissions: {
       CRM: 'C', PRICING: 'C,R,A', CREDIT: 'C,A', ORDERS: 'C,A', REPORTS: 'C',
      SECURITY: 'C,P', ING: 'C', PRO: 'C', FIN: 'C'
    }
  },
  {
    id: 'general-manager',
    name: 'Gerencia General',
    area: 'Alta Dirección',
    demoUser: 'gerencia.general',
    permissions: { CRM: 'C', PRICING: 'C,A', CREDIT: 'C,A', ORDERS: 'C', REPORTS: 'C', SECURITY: 'C,P', FIN: 'C' }
  },
  {
    id: 'legal-accounting',
    name: 'Asesoría Legal / Contable',
    area: 'Staff de Gerencia General',
    demoUser: 'asesoria.legal',
    permissions: { PRICING: 'C', ORDERS: 'C', SECURITY: 'C,P' }
  },
  {
    id: 'internal-audit',
    name: 'Asesoría de Auditoría Interna',
    area: 'Staff de Gerencia General',
    demoUser: 'auditoria.interna',
    permissions: { CRM: 'C', PRICING: 'C', CREDIT: 'C', ORDERS: 'C', REPORTS: 'C', SECURITY: 'C', ING: 'C', PRO: 'C', FIN: 'C', LOG: 'C' }
  },
  {
    id: 'product-engineering',
    name: 'Ingeniería y Diseño (Oficina Técnica)',
    area: 'Gerencia de Operaciones y Planta Industrial',
    demoUser: 'oficina.tecnica',
    permissions: { CRM: 'C', ING: 'C,R' }
  },
  {
    id: 'treasury',
    name: 'Tesorería',
    area: 'Gerencia de Finanzas y Administración',
    demoUser: 'tesoreria',
    permissions: { CREDIT: 'C,R', ORDERS: 'C', REPORTS: 'C', FIN: 'C,R' }
  },
  {
    id: 'credit-collections',
    name: 'Créditos y Cobranzas',
    area: 'Gerencia de Finanzas y Administración',
    demoUser: 'creditos.cobranzas',
    permissions: { CRM: 'C,R', CREDIT: 'C,R,A', ORDERS: 'C', REPORTS: 'C', FIN: 'C' }
  },
  {
    id: 'billing-accounting',
    name: 'Contabilidad y Facturación',
    area: 'Gerencia de Finanzas y Administración',
    demoUser: 'contabilidad.facturacion',
    permissions: { ORDERS: 'C', REPORTS: 'C', SECURITY: 'C,P', FIN: 'C,R' }
  },
  {
    id: 'erp-admin',
    name: 'Administrador del ERP (Sistemas y TI)',
    area: 'Gerencia de Finanzas y Administración',
    demoUser: 'admin.erp',
    permissions: { SECURITY: 'C,R,P' }
  },
  {
    id: 'production-chief',
    name: 'Jefatura de Producción',
    area: 'Gerencia de Operaciones y Planta Industrial',
    demoUser: 'jefatura.produccion',
    permissions: { ORDERS: 'C', PRO: 'C,R' }
  },
  {
    id: 'purchasing-chief',
    name: 'Jefatura de Compras y Abastecimiento',
    area: 'Gerencia de Logística y Suministros',
    demoUser: 'jefatura.compras',
    permissions: { ORDERS: 'C', PRO: 'C' }
  },
  {
    id: 'central-warehouse',
    name: 'Almacén Central CEDI',
    area: 'Gerencia de Logística y Suministros',
    demoUser: 'almacen.cedi',
    permissions: { CRM: 'C', ORDERS: 'C', LOG: 'C,R' }
  },
  {
    id: 'distribution-chief',
    name: 'Jefatura de Distribución y Transporte',
    area: 'Gerencia de Logística y Suministros',
    demoUser: 'jefatura.distribucion',
    permissions: { ORDERS: 'C', LOG: 'C,R' }
  },
  {
    id: 'customer-service-chief',
    name: 'Jefatura de Servicio al Cliente',
    area: 'Gerencia Comercial y Red de Sucursales',
    demoUser: 'jefatura.servicio',
    permissions: { CRM: 'C', ORDERS: 'C' }
  }
];

export function getRoleById(id: string | undefined): RoleDefinition | undefined {
  return ROLE_DEFINITIONS.find((role) => role.id === id);
}
