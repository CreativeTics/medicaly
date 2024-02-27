const location = window.location.host.replace(/:[0-9]*/, '')

export const DB_AUTH = {
  username: '4dm1n-us3r',
  password: '4dm1n-p4ssw0rd!!',
}

export const DB_URL = `http://localhost:4000/db`
export const WS_URL = `ws://${location}`

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
    name: 'Atencion',
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
    icon: 'File02Icon',
    children: [
      {
        name: 'Contratos',
        route: '/contracts',
        permission: 'contracts:list',
      },
    ],
  },

  {
    name: 'Tablas Basicas',
    icon: 'Tool02Icon',
    children: [
      {
        name: 'Basica',
        idMenu: '1',
        children: [
          {
            name: 'Paises',
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
        name: 'Examenes',
        idMenu: '1',
        children: [
          {
            name: 'Examenes',
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
        permission: 'subsidiaries',
      },
      {
        name: 'Cargos',
        route: '/positions',
        permission: 'positions:list',
      },
      {
        name: 'Empleados',
        route: '/employees',
        permission: 'roles:list',
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
    ],
  },
]
