import Home from '@/app/layouts/Home.vue'
import Login from '@/app/layouts/Login.vue'
import { App } from 'vue'

import {
  Building07Icon,
  CalculatorIcon,
  ClipboardCheckIcon,
  File02Icon,
  File07Icon,
  Home03Icon,
  Mail01Icon,
  PackageIcon,
  PlusIcon,
  SearchLgIcon,
  Shield02Icon,
  Ticket02Icon,
  Tool02Icon,
  User01Icon,
  Users01Icon,
} from '@components/basic/icons'

import CostCenterList from '../app/features/contracts/components/CostCenterList.vue'
import MedicalExamTypes from '../app/features/contracts/components/MedicalExamTypes.vue'
import PositionsList from '../app/features/contracts/components/PositionsList.vue'
import ServicesList from '../app/features/contracts/components/ServicesList.vue'
import SubsidiaryList from '../app/features/contracts/components/SubsidiaryList.vue'
import UserList from '../app/features/contracts/components/UserList.vue'
import ServiceOrderPatients from '../app/features/service-orders/components/Patients.vue'
import ServiceOrdersList from '../app/features/service-orders/components/ServicesList.vue'

export function registerGlobalComponents(app: App) {
  app.component('LoginLayout', Login)
  app.component('HomeLayout', Home)
  app.component('Home03Icon', Home03Icon)
  app.component('Tool02Icon', Tool02Icon)
  app.component('Users01Icon', Users01Icon)
  app.component('CalculatorIcon', CalculatorIcon)
  app.component('File07Icon', File07Icon)
  app.component('Shield02Icon', Shield02Icon)
  app.component('PackageIcon', PackageIcon)
  app.component('SearchLgIcon', SearchLgIcon)
  app.component('PlusIcon', PlusIcon)
  app.component('Mail01Icon', Mail01Icon)
  app.component('User01Icon', User01Icon)
  app.component('File02Icon', File02Icon)
  app.component('Ticket01Icon', Ticket02Icon)
  app.component('ClipboardCheckIcon', ClipboardCheckIcon)
  app.component('Building07Icon', Building07Icon)
  // //contracts
  app.component('ContractSubsidiaryList', SubsidiaryList)
  app.component('ContractCostCenterList', CostCenterList)
  app.component('ContractPositionsList', PositionsList)
  app.component('ContractMedicalExamTypes', MedicalExamTypes)
  app.component('ContractServicesList', ServicesList)
  app.component('ContractUserList', UserList)

  // service orders
  app.component('ServiceOrdersList', ServiceOrdersList)
  app.component('ServiceOrderPatients', ServiceOrderPatients)
}
