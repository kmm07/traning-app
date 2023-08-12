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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="signin" element={<SignInPage />} />

      <Route path="/" element={<Layout />}>
        <Route
          path="messages"
          index
          element={<Messages />}
          loader={messagesLoader}
        />
        <Route path="users" index element={<Users />} loader={usersLoader} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
