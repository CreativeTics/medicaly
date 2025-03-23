const location = window.location.host.replace(/:[0-9]*/, '')
// const location = 'app.javapsaludocupacional.com.co'
// const location = 'localhost:8080'

// export const API_URL = `http://${location}/api/v1`
// export const DB_URL = `http://${location}/db`
// export const WS_URL = `ws://${location}`
export const API_URL = `https://${location}/api/v1`
export const DB_URL = `https://${location}/db`
export const WS_URL = `wss://${location}`

export const menu = [
  {
    name: 'Home',
    icon: 'Home03Icon',
    route: '/home',
  },
  {
    name: 'Reportes',
    icon: 'File07Icon',
    route: '/home',
  },
  {
    name: 'Atención',
    icon: 'ClipboardCheckIcon',
    children: [
      {
        name: 'Ingreso de pacientes',
        route: '/patient-admission',
        permission: 'patient-admission:list',
      },
      {
        name: 'Atención de pacientes',
        route: '/patient-attention',
        permission: 'patient-attention:list',
      },
      {
        name: 'Laboratorios de pacientes',
        route: '/patient-laboratories',
        permission: 'patient-laboratories:list',
      },
      {
        name: 'Historia pacientes',
        route: '/patient-history',
        permission: 'patient-history:list',
      },
    ],
  },
  {
    name: 'Ordenes de servicio',
    icon: 'Ticket01Icon',
    children: [
      {
        name: 'Ordenes de servicio',
        route: '/service-orders',
        permission: 'service-orders:list',
      },
    ],
  },
  {
    name: 'Contratos',
    icon: 'Building07Icon',
    children: [
      {
        name: 'Contratos',
        route: '/contracts',
        permission: 'contracts:list',
      },
    ],
  },

  {
    name: 'Facturación',
    icon: 'File02Icon',
    children: [
      {
        name: 'Cuentas clientes',
        route: '/billing/customers',
        permission: 'billing:customers',
      },
      {
        name: 'Facturas generadas',
        route: '/billing/invoices',
        permission: 'billing:invoices',
      },
    ],
  },

  {
    name: 'Reportes',
    icon: 'File07Icon',
    children: [
      {
        name: 'Básicos',
        route: '/reports/basics',
        permission: 'reports:basics',
      },

      {
        name: 'RIPS',
        route: '/reports/rips',
        permission: 'reports:rips',
      },
    ],
  },
  {
    name: 'Tablas Básicas',
    icon: 'Tool02Icon',
    children: [
      {
        name: 'Básica',
        idMenu: '1',
        children: [
          {
            name: 'Países',
            route: '/countries',
            permission: 'countries:list',
          },
          {
            name: 'Departamentos',
            route: '/departments',
            permission: 'departments:list',
          },
          {
            name: 'Ciudades',
            route: '/cities',
            permission: 'cities:list',
          },
          {
            name: 'Tipos de identificación',
            route: '/identification-types',
            permission: 'identification-types:list',
          },
          {
            name: 'Entidades',
            route: '/entities',
            permission: 'entities:list',
          },
        ],
      },
      {
        name: 'Formularios',
        idMenu: '1',
        children: [
          {
            name: 'Restricciones',
            route: '/restrictions',
            permission: 'restrictions:list',
          },
          {
            name: 'Recomendaciones',
            route: '/recommendations',
            permission: 'recommendations:list',
          },
          {
            name: 'CIE10',
            route: '/cie10',
            permission: 'cie10:list',
          },
        ],
      },
      {
        name: 'Exámenes',
        idMenu: '1',
        children: [
          {
            name: 'Exámenes',
            route: '/exams',
            permission: 'exams:list',
          },
        ],
      },
    ],
  },
  {
    name: 'Administración',
    icon: 'Shield02Icon',
    children: [
      {
        name: 'Sedes de atención',
        route: '/subsidiaries',
        permission: 'subsidiaries:list',
      },
      {
        name: 'Cargos',
        route: '/positions',
        permission: 'positions:list',
      },
      {
        name: 'Empleados',
        route: '/employees',
        permission: 'employees:list',
      },
      {
        name: 'Laboratorios',
        route: '/laboratories',
        permission: 'laboratories:list',
      },
      {
        name: 'Roles',
        route: '/roles',
        permission: 'roles:list',
      },
      {
        name: 'Usuarios',
        route: '/users',
        permission: 'users:list',
      },
    ],
  },
]

export const menuFilteredByPermissions = (permissions: string[]) => {
  return menu
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child: any) => {
            if (child.children) {
              child.children = child.children.filter((subChild: any) => {
                return (
                  !subChild.permission ||
                  permissions.includes(subChild.permission)
                )
              })
              return child.children.length > 0
            } else {
              return !child.permission || permissions.includes(child.permission)
            }
          }),
        }
      }
      return item
    })
    .filter((item) => item.children && item.children.length > 0)
}
