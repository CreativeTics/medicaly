import { defineStore } from 'pinia'

interface ExamAttention {
  id: string
  serviceId?: string
  annotation?: string
}

//{ "id": "7dd9d0d73ec9e207d7ea5aa7cd01f6e9", "code": "002", "name": "Bodeguero", "amount": "20000", "exams": [ "41d48924e1e882268c4ccd2ca8005ed5", "41d48924e1e882268c4ccd2ca8004fba", "41d48924e1e882268c4ccd2ca8006e59", "bc6610eeceb3d2a624f6fdfa57001208" ], "showForContract": true, "visibleExams": [ "41d48924e1e882268c4ccd2ca8004fba", "bc6610eeceb3d2a624f6fdfa57001208" ], "examTypeName": "INGRESO:TRABAJO EN ALTURAS", "status": "PENDIENTE", "annotations": [ "2024:286c36ab21e6b5d2a56e747cde0004b2:7dd9d0d73ec9e207d7ea5aa7cd01f6e9:41d48924e1e882268c4ccd2ca8005ed5", "2024:286c36ab21e6b5d2a56e747cde0004b2:7dd9d0d73ec9e207d7ea5aa7cd01f6e9:41d48924e1e882268c4ccd2ca8004fba" ] }

interface OrderService {
  id: string
  code: string
  name: string
  exams: string[]
  visibleExams: string[]
  examTypeName: string
  status: string
  annotations: string[]
}

export const useAttentionStore = defineStore('patient-attention', {
  state: () => {
    return {
      orderCode: '',
      exams: [] as ExamAttention[],
    }
  },
  getters: {
    completedExams(): ExamAttention[] {
      return this.exams.filter((exam) => exam.annotation)
    },
    orderISComplete(): boolean {
      return this.exams.every((exam) => exam.annotation !== undefined)
    },
  },

  actions: {
    clean() {
      this.orderCode = ''
      this.exams = []
    },

    loadOrder(orderCode: string, orderServices: OrderService[]) {
      this.clean()
      console.log(orderServices)
      this.orderCode = orderCode
      orderServices.forEach((service) => {
        service.exams.forEach((examId) => {
          const annotation = service.annotations?.find((a) =>
            a.includes(`${service.id}:${examId}`)
          )
          this.exams.push({
            id: examId,
            serviceId: service.id,
            annotation,
          })
        })
      })
    },

    async setAnnotation(examId: string, annotation: string) {
      console.log('setAnnotation', examId, annotation)

      const exam = this.exams.find((e) => e.id === examId)

      if (exam) {
        exam.annotation = annotation
      }
    },
  },
})
