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
import Subscriptions from "pages/subscriptions";
import UserSubscriptions from "pages/Users/subscriptions";
import UserPlan from "pages/Users/plan";
import ViewWeekDay from "pages/view-week-days";
import Coupones from "pages/coupones";
import Admin from "pages/admin/Index";
import ContactsPage from "pages/contacts";
import SystemNotices from "pages/system-notices";
import InsightRecommendations from "pages/insight-recommendations";
import Analytics from "pages/analytics";
import RouteError from "components/ErrorBoundary/RouteError";

const router = createBrowserRouter(
  createRoutesFromElements(
    /*
      `errorElement` على الجذر يلتقط استثناءَ الرسم في أيّ صفحةٍ تحته — وكان
      غيابُه يعني **شاشةً بيضاء بلا أثر**. ويُكرَّر على `Layout` كي يبقى
      الشريطُ الجانبيّ قائماً حين تسقط صفحةٌ واحدة، فلا يفقد المدرّب تنقّله
      كلَّه لأجل شاشةٍ واحدة.
    */
    <Route path="/" errorElement={<RouteError />}>
      <Route path="/" element={<SignInPage />} />

      <Route path="/" element={<Layout />} errorElement={<RouteError />}>
        <Route path="/dashboard" element={<Messages />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admins" element={<Admin />} />
        <Route path="users" index element={<Users />} />
        <Route
          path="/users/:id/subscriptions"
          element={<UserSubscriptions />}
        />
        <Route path="/users/:id/plan" element={<UserPlan />} />
        <Route path="subscriptions" index element={<Subscriptions />} />
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
          <Route path="week-days/:id" element={<ViewWeekDay />} />
        </Route>

        <Route path="notifications" element={<Notifications />} />

        <Route path="coupones" element={<Coupones />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="system-notices" element={<SystemNotices />} />
        <Route
          path="insight-recommendations"
          element={<InsightRecommendations />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;
