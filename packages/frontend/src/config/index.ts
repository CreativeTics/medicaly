// const location = window.location.host.replace(/:[0-9]*/, "");

export const DB_AUTH = {
  username: "4dm1n-us3r",
  password: "4dm1n-p4ssw0rd!!",
};

export const DB_URL = "http://localhost:5984";

export const menu = [
  {
    name: "Home",
    icon: "Home03Icon",
    route: "/home",
  },
  {
    name: "Configuración",
    icon: "Tool02Icon",
    children: [
      {
        name: "Basica",
        idMenu: "1",
        children: [
          {
            name: "Jornadas",
            route: "/journeys",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Monedas",
            route: "/currencies",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Tipo identificación",
            route: "/identification-types",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Lista de festivos",
            route: "/list-holidays",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Países",
            route: "/countries",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Estado",
            route: "/states",
            permission: "CREATE-PAYROLL",
          },
        ],
      },
      {
        name: "Implementación",
        idMenu: "1",
        children: [
          {
            name: "Calendarios",
            route: "/calendars",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Compañias",
            route: "/companies",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Sucursales",
            route: "/locations",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Direcciones",
            route: "/directions",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Gerencias",
            route: "/managements",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Departamentos",
            route: "/departments",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Cargos",
            route: "/positions",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Centros de Costo",
            route: "/cost-centers",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Turnos",
            route: "/turns",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Entidades",
            route: "/entities",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Maestro Conceptos",
            route: "/concept-masters",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Topes",
            route: "/caps",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Cuentas Contables",
            route: "/accounts",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Conceptos por Nómina",
            route: "/payroll-concepts",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Nóminas",
            route: "/payrolls",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Bancos",
            route: "/banks",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Tipos de Cambio",
            route: "/exchange-rates",
            permission: "CREATE-PAYROLL",
          },
        ],
      },
    ],
  },
  {
    name: "Empleados",
    icon: "Users01Icon",
    route: "/home",
  },
  {
    name: "Procesos",
    icon: "CalculatorIcon",
    children: [
      {
        name: "Nóminas",
        idMenu: "3",
        children: [
          {
            name: "Incidencias",
            route: "/incidents",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Incidencias Recurrentes",
            route: "/recurring-incidents",
            permission: "CREATE-PAYROLL",
          },
        ],
      },
      {
        name: "Licencias",
        idMenu: "3",
        children: [
          {
            name: "Tipos de Licencia",
            route: "/license-types",
            permission: "CREATE-PAYROLL",
          },
          {
            name: "Solicitud de Licencia y permisos",
            route: "/license-request",
            permission: "CREATE-PAYROLL",
          },
        ],
      },
      {
        name: "Préstamos",
        idMenu: "3",
        children: [
          {
            name: "Registro de Préstamos",
            route: "/loans",
            permission: "CREATE-PAYROLL",
          },
        ],
      },
    ],
  },
  {
    name: "Reportes",
    icon: "File07Icon",
    route: "/home",
  },
  {
    name: "Administración",
    icon: "Shield02Icon",
    children: [
      {
        name: "Usuarios",
        route: "/users",
      },
      {
        name: "Roles",
        route: "/roles",
      },
    ],
  },
];
