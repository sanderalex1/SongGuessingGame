import { createBrowserRouter } from "react-router-dom";
import Login from "../components/LoginPage";
import Register from "../components/RegisterPage";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

export default router;
