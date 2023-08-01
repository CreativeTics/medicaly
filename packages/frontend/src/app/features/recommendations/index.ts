import RecommendationsList from "./views/List.vue";
import RecommendationsCreate from "./views/CreateEdit.vue";

export const recommendationsRoutes = [
  {
    path: "/recommendations",
    name: "recommendations.list",
    component: RecommendationsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/recommendations/create",
    name: "recommendations.create",
    component: RecommendationsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/recommendations/edit/:id",
    name: "recommendations.edit",
    component: RecommendationsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
