import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "./components/FirstView.vue";
import MainView from "./components/MainView.vue"; 
import TestResult from "./components/TestResult.vue"
import ResultView from "./components/ResultView.vue"

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/mainView", component: MainView},
  { path: "/testResult", component: TestResult}, 
  { path: "/resultView", component: ResultView}, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
