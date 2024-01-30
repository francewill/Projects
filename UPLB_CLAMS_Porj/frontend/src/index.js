import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Login from "./pages/loginPage/loginPage";
import SignUp from "./pages/signUpPage/signUpPage";
import LoginUser from "./pages/loginForm/loginForm";

import AdminRoot from "./pages/adminPages/adminRoot";
import AdminStudentAccountsView from "./pages/adminPages/adminStudentAccountsView";
import AdminApproverAccountsView from "./pages/adminPages/adminApproverAccountsView";
import AdminHomePage from "./pages/adminPages/adminHomePage";
import NavBarStudent from "./pages/studentView/nav";
import Clearance from "./pages/studentView/statusClearance";
import Home from "./pages/studentView/home";
import Requirements from "./pages/studentView/submitReq";
import NavBarApprover from "./pages/approverPages/approvernav";
import ApproverHome from "./pages/approverPages/approverhome";
import PendingApplication from "./pages/approverPages/pendingapplications";
import CreateApprover from "./pages/adminPages/adminCreateApprover";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/user",
    element: <LoginUser />,
  },
  {
    path: "/user/student",
    element: <NavBarStudent />,
    children: [
      { path: "/user/student", element: <Home /> },
      { path: "/user/student/clearance", element: <Clearance /> },
      { path: "/user/student/requirements", element: <Requirements /> },
      // { path: 'subjects', element: <Subjects /> },
    ],
  },
  {
    path: "/user/admin",
    element: <AdminRoot />,
    children: [
      { path: "/user/admin", element: <AdminHomePage /> },
      { path: "student-accounts", element: <AdminStudentAccountsView /> },
      { path: "approver-accounts", element: <AdminApproverAccountsView /> },
      { path: "/user/admin/create-approver", element: <CreateApprover /> },
    ],
  },
  {
    path: "/user/approver",
    element: <NavBarApprover />,
    children: [
      { path: "/user/approver", element: <ApproverHome /> },
      { path: "/user/approver/pending", element: <PendingApplication /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
