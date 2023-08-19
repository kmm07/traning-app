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
import Descriptions, { descriptionsLoader } from "pages/Nutrition/Descriptions";
import Ingredients from "pages/Nutrition/Ingredients";

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
            loader={descriptionsLoader}
          />
          <Route path="ingredients" element={<Ingredients />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
