import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import { Provider } from "react-redux";
import { store } from "redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App() {
  const queryClint = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClint.current}>
      <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"dark"}
        />
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}
