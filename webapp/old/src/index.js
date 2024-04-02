import React from "react";
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} basename={process.env.REACT_APP_HOME_PAGE} />
    <ToastContainer />
  </React.StrictMode>
);
