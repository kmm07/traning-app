import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NotFound from "pages/NotFound";
import SignInPage from "pages/SignIn";
import Messages, { messagesLoader } from "pages/Messages";
import Layout from "layout";
import Users, { usersLoader } from "pages/Users";
import Descriptions, { DescriptionsLoader } from "pages/Nutrition/Descriptions";

import MenTraining, { MenTrainingLoader } from "pages/Traning/Men";
import Ingredients, { IngredientsLoader } from "pages/Nutrition/Ingredients";
import ExercisesGym, { ExercisesGymLoader } from "pages/Traning/Exercises-Gym";
import ExercisesHome, {
  ExercisesHomeLoader,
} from "pages/Traning/Exercises-Home";
import WomenTraining, { WomenTrainingLoader } from "pages/Traning/Women";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="signin" element={<SignInPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Messages />} loader={messagesLoader} />
        <Route path="users" index element={<Users />} loader={usersLoader} />
        <Route path="/nutrition">
          <Route
            path="descriptions"
            element={<Descriptions />}
            loader={DescriptionsLoader}
          />
          <Route
            path="ingredients"
            element={<Ingredients />}
            loader={IngredientsLoader}
          />
        </Route>

        <Route path="/exercises">
          <Route
            path="table-men"
            element={<MenTraining />}
            loader={MenTrainingLoader}
          />
          <Route
            path="table-women"
            element={<WomenTraining />}
            loader={WomenTrainingLoader}
          />
          <Route
            path="exercises-gym"
            element={<ExercisesGym />}
            loader={ExercisesGymLoader}
          />
          <Route
            path="exercises-home"
            element={<ExercisesHome />}
            loader={ExercisesHomeLoader}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
