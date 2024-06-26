import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "./components/FirstView.vue";
import MainView from "./components/MainView.vue"; 
import TestResult from "./components/TestResult.vue"
import ResultView from "./components/ResultView.vue"
import SummaryView from "./components/SummaryView.vue"
import ComplexityTable from "./components/ComplexityTable.vue"
import ComplexityMatrix from "./components/ComplexityMatrix.vue"
import ImageDisplay from "./components/ImageDisplay.vue"
import RatingDeviation from "./components/RatingDeviation.vue"
import ErrorEvaluation from "./components/ErrorEvaluation.vue"

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/mainView", component: MainView},
  { path: "/testResult", component: TestResult}, 
  { path: "/resultView", component: ResultView}, 
  { path: "/summaryView", component: SummaryView}, 
  { path: "/complexityTable", component: ComplexityTable}, 
  { path: "/complexityMatrix", component: ComplexityMatrix}, 
  { path: "/imageDisplay", component: ImageDisplay}, 
  { path: "/ratingDeviation", component: RatingDeviation}, 
  { path: "/errorEvaluation", component: ErrorEvaluation},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
