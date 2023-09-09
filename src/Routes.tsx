import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NotFound from "pages/NotFound";
import SignInPage from "pages/SignIn";
import Messages from "pages/Messages";
import Layout from "layout";
import Users from "pages/Users";
import Descriptions from "pages/Nutrition/Descriptions";

import MenTraining from "pages/Exercises/Men";
import Ingredients from "pages/Nutrition/Ingredients";
import ExercisesGym from "pages/Exercises/Exercises-Gym";
import TableHome from "pages/Exercises/Table-Home";
import WomenTraining from "pages/Exercises/Women";
import ExercisesHome from "pages/Exercises/Exercises-Home";
import Notifications from "pages/Notifications";
import Cardio from "pages/Exercises/Cardio";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="signin" element={<SignInPage />} />

      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Messages />} />
        <Route path="users" index element={<Users />} />
        <Route path="/nutrition">
          <Route path="descriptions" element={<Descriptions />} />
          <Route path="ingredients" element={<Ingredients />} />
        </Route>

        <Route path="/exercises">
          <Route path="table-men" element={<MenTraining />} />
          <Route path="table-women" element={<WomenTraining />} />
          <Route path="exercises-gym" element={<ExercisesGym />} />
          <Route path="exercises-home" element={<ExercisesHome />} />
          <Route path="table-home" element={<TableHome />} />
          <Route path="cardio" element={<Cardio />} />
        </Route>

        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
