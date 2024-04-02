import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import MatchingServicePage from "../pages/MatchingServicePage";
import AuthServicePage from "../pages/AuthServicePage";
import SmartContractPage from "../pages/SmartContractPage";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: process.env.REACT_APP_HOME_PAGE,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MatchingServicePage />,
      },
      {
        index: true,
        path: "matching-service",
        element: <MatchingServicePage />,
      },
      {
        path: "auth-service",
        element: <AuthServicePage />,
      },
      {
        path: "smart-contract",
        element: <SmartContractPage />,
      },
      {
        path: "*",
        element: <App />,
      },
    ],
  },
]);
