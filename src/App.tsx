import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import { Provider } from "react-redux";
import { store } from "redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";

export default function App() {
  const queryClint = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClint.current}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}
