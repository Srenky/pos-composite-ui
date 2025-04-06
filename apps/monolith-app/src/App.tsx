import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BackofficePage from "./pages/BackofficePage";
import CheckoutPage from "./pages/CheckoutPage";
import KitchenPage from "./pages/KitchenDisplayPage";
import { Profiler } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/backoffice",
    element: <BackofficePage />,
  },
  {
    path: "/kitchen",
    element: <KitchenPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
]);

const onRenderCallback = (
  id: string,
  phase: string,
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) => {
  console.log("id: ", id);
  console.log("phase: ", phase);
  console.log("actualDuration: ", actualDuration);
  console.log("baseDuration: ", baseDuration);
  console.log("startTime: ", startTime);
  console.log("commitTime: ", commitTime);
};

export default function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <div>
        <RouterProvider router={router} />
      </div>
    </Profiler>
  );
}
