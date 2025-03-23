import { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@features/auth'
import { billingRoutes } from '@features/billing'
import { cie10Routes } from '@features/cie10'
import { citiesRoutes } from '@features/cities'
import { contractsRoutes } from '@features/contracts'
import { countriesRoutes } from '@features/countries'
import { departmentsRoutes } from '@features/departments'
import { employeesRoutes } from '@features/employees'
import { entitiesRoutes } from '@features/entities'
import { examsRoutes } from '@features/exams'
import { identificationTypesRoutes } from '@features/identification-types'
import { laboratoriesRoutes } from '@features/laboratories'
import { patientAdmissionRoutes } from '@features/patient-admission'
import { patientAttentionRoutes } from '@features/patient-attention'
import { patientHistoryRoutes } from '@features/patient-history'
import { patientLaboratoryRoutes } from '@features/patient-laboratories'
import { positionsRoutes } from '@features/positions'
import { recommendationsRoutes } from '@features/recommendations'
import { reportsRoutes } from '@features/reports'
import { restrictionsRoutes } from '@features/restrictions'
import { serviceOrdersRoutes } from '@features/service-orders'
import { signaturePadRoutes } from '@features/signature-pad'
import { subsidiariesRoutes } from '@features/subsidiaries'

export const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/app/features/home/views/Home.vue'),
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  ...authRoutes,
  ...employeesRoutes,
  ...positionsRoutes,
  ...laboratoriesRoutes,
  ...countriesRoutes,
  ...departmentsRoutes,
  ...citiesRoutes,
  ...identificationTypesRoutes,
  ...entitiesRoutes,
  ...restrictionsRoutes,
  ...recommendationsRoutes,
  ...cie10Routes,
  ...examsRoutes,
  ...contractsRoutes,
  ...subsidiariesRoutes,
  ...serviceOrdersRoutes,
  ...patientAdmissionRoutes,
  ...patientAttentionRoutes,
  ...patientLaboratoryRoutes,
  ...signaturePadRoutes,
  ...patientHistoryRoutes,
  ...reportsRoutes,
  ...billingRoutes,
]
