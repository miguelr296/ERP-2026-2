import { MenuSystem, Permission, SubsystemId } from '../models/access.model';

const REGISTER_CODES = new Set([
  'COM.01.1.1.1', 'COM.01.2.1.1', 'COM.01.2.1.2', 'COM.01.2.1.3', 'COM.01.3.2.2', 'COM.01.4.1.1',
  'COM.02.1.1.1', 'COM.02.2.1.1', 'COM.02.2.1.2', 'COM.02.2.1.3', 'COM.02.2.2.1', 'COM.03.1.1.1', 'COM.03.2.2.1',
  'COM.04.1.1.1', 'COM.04.1.4.1', 'COM.04.2.1.1', 'ING.01.1.2.1', 'PRO.01.2.1.1', 'FIN.01.1.1.1', 'FIN.01.1.2.1',
  'FIN.02.2.1.1', 'LOG.01.1.1.1'
]);
const APPROVE_CODES = new Set(['COM.02.3.1.1', 'COM.04.1.3.1']);
const PARAMETERIZE_CODES = new Set([
  'COM.06.1.1.1', 'COM.06.1.2.1', 'COM.06.1.3.1', 'COM.06.1.4.1', 'COM.06.2.1.1'
]);
const CONSULT_CODES = new Set([
  'COM.01.1.2.1', 'COM.01.1.2.2', 'COM.01.1.3.1', 'COM.01.3.1.1', 'COM.01.3.2.1', 'COM.01.4.2.1',
  'COM.02.1.2.1', 'COM.02.2.3.1', 'COM.02.3.2.1', 'COM.03.1.2.1', 'COM.03.2.1.1', 'COM.04.1.2.1',
  'COM.04.2.2.1', 'COM.05.1.1.1', 'COM.05.2.1.1', 'ING.01.1.1.1', 'PRO.01.1.1.1',
  'FIN.02.1.1.1'
]);

export function permissionForMenuCode(code: string): Permission {
  if (REGISTER_CODES.has(code)) return 'R';
  if (APPROVE_CODES.has(code)) return 'A';
  if (PARAMETERIZE_CODES.has(code)) return 'P';
  if (CONSULT_CODES.has(code)) return 'C';
  return 'C';
}

const item = (code: string, module: string, option: string, label: string) => ({ code, module, option, label, permission: permissionForMenuCode(code) });

export const MENU_SYSTEMS: MenuSystem[] = [
  {
    id: 'SIS-COM', label: 'Sistema Comercial', shortLabel: 'COM', accent: 'blue',
    subsystems: [
      {
        id: 'CRM', label: 'CRM y Pre-venta', icon: 'users',
        items: [
          item('COM.01.1.1.1', 'Clientes', 'Registro de clientes', 'Nuevo cliente'),
          item('COM.01.1.2.1', 'Clientes', 'Consulta de clientes', 'Búsqueda de clientes'),
          item('COM.01.1.2.2', 'Clientes', 'Consulta de clientes', 'Historial de compras del cliente'),
          item('COM.01.1.3.1', 'Clientes', 'Expediente B2B', 'Expediente de crédito y documentos'),
          item('COM.01.2.1.1', 'Oportunidades', 'Registro de oportunidades', 'Oportunidad retail'),
          item('COM.01.2.1.2', 'Oportunidades', 'Registro de oportunidades', 'Oportunidad B2B / licitación'),
          item('COM.01.2.1.3', 'Oportunidades', 'Registro de oportunidades', 'Adjuntos y especificaciones'),
          item('COM.01.2.2.1', 'Oportunidades', 'Seguimiento de oportunidades', 'Bandeja y recordatorios'),
          item('COM.01.3.1.1', 'Catálogo y Disponibilidad', 'Catálogo comercial', 'Consulta de catálogo'),
          item('COM.01.3.2.1', 'Catálogo y Disponibilidad', 'Disponibilidad de stock', 'Stock por sede'),
          item('COM.01.3.2.2', 'Catálogo y Disponibilidad', 'Disponibilidad de stock', 'Traslado o reposición'),
          item('COM.01.4.1.1', 'Solicitudes de Costeo (MTO)', 'Nueva solicitud de costeo', 'Registro de solicitud'),
          item('COM.01.4.2.1', 'Solicitudes de Costeo (MTO)', 'Seguimiento de solicitudes', 'Estado y alertas')
        ]
      },
      {
        id: 'PRICING', label: 'Precios y Cotizaciones', icon: 'tag',
        items: [
          item('COM.02.1.1.1', 'Listas de Precios', 'Mantenimiento de listas', 'Lista por unidad de negocio y sede'),
          item('COM.02.1.2.1', 'Listas de Precios', 'Consulta de precios', 'Precio vigente por SKU'),
          item('COM.02.2.1.1', 'Cotizaciones', 'Nueva cotización', 'Cotización retail y catálogo'),
          item('COM.02.2.1.2', 'Cotizaciones', 'Nueva cotización', 'Cotización B2B a medida'),
          item('COM.02.2.1.3', 'Cotizaciones', 'Nueva cotización', 'Fecha de entrega sugerida'),
          item('COM.02.2.2.1', 'Cotizaciones', 'Emisión y envío', 'Generar PDF y enviar'),
          item('COM.02.2.3.1', 'Cotizaciones', 'Bandeja de cotizaciones', 'Estados y seguimiento'),
          item('COM.02.3.1.1', 'Aprobación de Descuentos', 'Bandeja de aprobaciones', 'Solicitudes pendientes'),
          item('COM.02.3.2.1', 'Aprobación de Descuentos', 'Historial de aprobaciones', 'Consulta de historial')
        ]
      },
      {
        id: 'CREDIT', label: 'Crédito y Pagos', icon: 'wallet',
        items: [
          item('COM.03.1.1.1', 'Pagos y Anticipos', 'Registro de pagos', 'Registrar pago o anticipo'),
          item('COM.03.1.2.1', 'Pagos y Anticipos', 'Estado de pagos', 'Pagos confirmados y pendientes'),
          item('COM.03.2.1.1', 'Evaluación de Crédito', 'Semáforo de crédito', 'Saldo disponible y bloqueo'),
          item('COM.03.2.2.1', 'Evaluación de Crédito', 'Excepciones de crédito', 'Solicitud y resolución')
        ]
      },
      {
        id: 'ORDERS', label: 'Pedidos de Venta', icon: 'box',
        items: [
          item('COM.04.1.1.1', 'Notas de Pedido', 'Generar pedido', 'Conversión desde cotización'),
          item('COM.04.1.2.1', 'Notas de Pedido', 'Bandeja de pedidos', 'Estado del pedido'),
          item('COM.04.1.3.1', 'Notas de Pedido', 'Cambios y anulaciones', 'Versionado y anulación'),
          item('COM.04.1.4.1', 'Notas de Pedido', 'Contrato B2B', 'Adjunto y condiciones contractuales'),
          item('COM.04.2.1.1', 'Reservas y Notificaciones', 'Reservas de stock', 'Reserva MTS y caducidad'),
          item('COM.04.2.2.1', 'Reservas y Notificaciones', 'Notificaciones', 'Bandeja de alertas')
        ]
      },
      {
        id: 'REPORTS', label: 'Reportes y Tablero', icon: 'chart-bar',
        items: [
          item('COM.05.1.1.1', 'Tablero Comercial', 'Tablero de KPIs', 'Indicadores comerciales'),
          item('COM.05.2.1.1', 'Reportes Comerciales', 'Control de políticas', 'Descuentos fuera de política')
        ]
      },
      {
        id: 'SECURITY', label: 'Parametrización y Seguridad', icon: 'sliders-h',
        items: [
          item('COM.06.1.1.1', 'Políticas Comerciales', 'Descuentos y márgenes', 'Tabla de descuentos y margen mínimo'),
          item('COM.06.1.2.1', 'Políticas Comerciales', 'Niveles de aprobación', 'Aprobadores por nivel'),
          item('COM.06.1.3.1', 'Políticas Comerciales', 'Parámetros generales', 'Vigencias, reservas, IGV y series'),
          item('COM.06.1.4.1', 'Políticas Comerciales', 'Condiciones legales y de garantía', 'Plantillas por unidad de negocio'),
          item('COM.06.2.1.1', 'Seguridad', 'Usuarios y roles', 'Perfiles por sede'),
          item('COM.06.2.2.1', 'Seguridad', 'Bitácora de auditoría', 'Consulta de bitácora')
        ]
      }
    ]
  },
  {
    id: 'SIS-ING', label: 'Ingeniería de Producto', shortLabel: 'ING', accent: 'green',
    subsystems: [{ id: 'ING', label: 'Costeo de Proyectos', icon: 'pencil', items: [
      item('ING.01.1.1.1', 'Bandeja de Costeo', 'Solicitudes recibidas', 'Bandeja de Oficina Técnica'),
      item('ING.01.1.2.1', 'Bandeja de Costeo', 'Hoja de Costo', 'Hoja de Costo electrónica')
    ] }]
  },
  {
    id: 'SIS-PRO', label: 'Producción', shortLabel: 'PRO', accent: 'orange',
    subsystems: [{ id: 'PRO', label: 'Planificación', icon: 'cog', items: [
      item('PRO.01.1.1.1', 'Capacidad de Planta', 'Carga por centro de trabajo', 'Consulta de capacidad'),
      item('PRO.01.2.1.1', 'Órdenes de Trabajo', 'Solicitud de producción', 'Generación de OT desde pedido')
    ] }]
  },
  {
    id: 'SIS-FIN', label: 'Finanzas y Tesorería', shortLabel: 'FIN', accent: 'purple',
    subsystems: [
      { id: 'FIN', label: 'Tesorería y Bancos', icon: 'building-columns', items: [
        item('FIN.01.1.1.1', 'Conciliación Bancaria', 'Extracto bancario', 'Importar extracto'),
        item('FIN.01.1.2.1', 'Conciliación Bancaria', 'Conciliación', 'Conciliación automática y pendientes')
      ] },
      { id: 'FIN', label: 'Facturación y CxC', icon: 'file', items: [
        item('FIN.02.1.1.1', 'Cuentas por Cobrar', 'Estado de cuenta del cliente', 'Consulta de CxC y vencidos'),
        item('FIN.02.2.1.1', 'Facturación', 'Facturación desde pedido', 'Habilitación de factura y guía')
      ] }
    ]
  },
  {
    id: 'SIS-LOG', label: 'Logística y Distribución', shortLabel: 'LOG', accent: 'red',
    subsystems: [{ id: 'LOG', label: 'Distribución', icon: 'truck', items: [
      item('LOG.01.1.1.1', 'Despachos', 'Guía de remisión', 'Emisión desde pedido')
    ] }]
  }
];

export function visibleMenuFor(permissions: Partial<Record<SubsystemId, string>>): MenuSystem[] {
  return MENU_SYSTEMS.map((system) => ({
    ...system,
    subsystems: system.subsystems.map((subsystem) => ({
      ...subsystem,
      items: subsystem.items.filter((menuItem) => hasPermission(permissions[subsystem.id], menuItem.permission))
    })).filter((subsystem) => subsystem.items.length > 0)
  })).filter((system) => system.subsystems.length > 0);
}

export function hasPermission(granted: string | undefined, required: Permission): boolean {
  return Boolean(granted?.split(',').map((permission) => permission.trim()).includes(required));
}

export function findMenuItem(code: string | null | undefined): { item: import('../models/access.model').MenuItem; system: MenuSystem; subsystem: import('../models/access.model').MenuSubsystem } | undefined {
  for (const system of MENU_SYSTEMS) {
    for (const subsystem of system.subsystems) {
      const found = subsystem.items.find((menuItem) => menuItem.code === code);
      if (found) return { item: found, system, subsystem };
    }
  }
  return undefined;
}
