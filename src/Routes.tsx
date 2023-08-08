import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import SignInPage from "pages/SignIn";
import Dashboard, { dashboardLoader } from "pages/Dashboard";
import Layout from "layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="signin" element={<SignInPage />} />

      <Route path="dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} loader={dashboardLoader} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
