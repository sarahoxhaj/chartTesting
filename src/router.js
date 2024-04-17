import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import MainView from "./components/MainView.vue"; // Create a new component for the "hello" view

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/mainView", component: MainView }, // Define a route for the "hello" view
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
