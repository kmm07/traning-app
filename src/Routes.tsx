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

import Ingredients from "pages/Nutrition/Ingredients";
import ExercisesGym from "pages/Exercises/Exercises-Gym";
import ExercisesHome from "pages/Exercises/Exercises-Home";
import Notifications from "pages/Notifications";
import Cardio from "pages/Exercises/Cardio";
import GymMen from "pages/Exercises/gym-men";
import GymWomen from "pages/Exercises/gym-women";
import HomeMen from "pages/Exercises/home-men";
import HomeWomen from "pages/Exercises/home-women";

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
          <Route path="table-men" element={<GymMen />} />
          <Route path="table-women" element={<GymWomen />} />
          <Route path="exercises-gym" element={<ExercisesGym />} />
          <Route path="exercises-home" element={<ExercisesHome />} />
          <Route path="table-home-men" element={<HomeMen />} />
          <Route path="table-home-women" element={<HomeWomen />} />
          <Route path="cardio" element={<Cardio />} />
        </Route>

        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
