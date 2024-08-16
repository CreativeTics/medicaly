import { defineStore } from 'pinia'

interface Exam {
  id: string
  name: string
  completed?: boolean
}

export const useAttentionStore = defineStore('patient-attention', {
  state: () => {
    return {
      orderCode: '',
      exams: [] as Exam[],
    }
  },
  getters: {
    completedExams(): Exam[] {
      return this.exams.filter((exam) => exam.completed)
    },
  },

  actions: {
    setOrder(orderCode: string, exams: Exam[]) {
      this.orderCode = orderCode
      this.exams = exams
    },

    async setCompleteExam(examId: string) {
      const exam = this.exams.find((e) => e.id === examId)

      if (exam) {
        exam.completed = true
      }
    },
  },
})
