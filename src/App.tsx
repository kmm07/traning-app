import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import { Provider } from "react-redux";
import { store } from "redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
