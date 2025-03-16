import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppwriteProvider } from "./Context/AppwriteContext";
import Layout from "./Layout/Layout.jsx";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import Client from "./Pages/Client";
import Finance from "./Pages/Finance";
import Setting from "./Pages/Settings";
import Report from "./Pages/Report";
import ClientDetails from "./Pages/ClientDetails.jsx";
import InvoiceDetails from "./Components/InvoiceDetails.jsx";
import Login from "./Pages/login.jsx"
import Signup from "./Pages/signup.jsx";
import ForgotPassword from "./Pages/forgotpass.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import { useDispatch } from "react-redux";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import { restoreAuthStart, restoreAuthSuccess, restoreAuthFailure } from "./Features/authSlice.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/appointments", element: <Appointment /> },
          { path: "/clients", element: <Client /> },
          { path: "/clients/:clientId", element: <ClientDetails /> },
          { path: "/finance", element: <Finance /> },
          { path: "/invoices/:id", element: <InvoiceDetails /> },
          { path: "/settings", element: <Setting /> },
          { path: "/reports", element: <Report /> },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuthStart()); // Indicate that we're restoring the auth state
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(restoreAuthSuccess(user)); // Restore the user's authentication state
    } else {
      dispatch(restoreAuthFailure()); // No user found in localStorage
    }
  }, [dispatch]);

  return (
    <AppwriteProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </AppwriteProvider>
  );
}


export default App;

