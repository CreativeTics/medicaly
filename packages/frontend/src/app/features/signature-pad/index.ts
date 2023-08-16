import SignaturePad from "./views/Pad.vue"

export const signaturePadRoutes = [
  {
    path: "/signature-pad/:code",
    name: "signature-pad",
    component: SignaturePad,
    meta: {
      auth: false,
      layout: "public",
    },
  },
]
