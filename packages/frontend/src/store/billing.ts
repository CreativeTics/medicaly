import { defineStore } from 'pinia'

export interface AccountOfFinishedOrdersFilters {
  subsidiaryId: string
  startDate: string
  endDate: string
  contractName: string
}
export interface AccountOfFinishedOrders {
  contractName: string
  contractId: string
  subsidiaryId: string
  subsidiaryName: string
  totalOrders: number
  totalAmount: number
  totalAmountFormatted: string
  orders: string[]
  filters?: AccountOfFinishedOrdersFilters
}

export const useBillingStore = defineStore('billing', {
  state: () => {
    return {
      activeAccount: null as AccountOfFinishedOrders | null,
    }
  },

  actions: {
    setActiveAccount(account: AccountOfFinishedOrders) {
      this.activeAccount = account
    },
    resetActiveAccount() {
      this.activeAccount = null
    },
    removeOrder(orderId: string) {
      if (!this.activeAccount) return
      this.activeAccount.orders = this.activeAccount.orders.filter(
        (id) => id !== orderId
      )
    },
  },
})
