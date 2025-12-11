import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import RootLayout from "../layouts/RootLayout";
import Clubs from "../pages/Clubs";
import Events from "../pages/Events";
import Dashboard from "../layouts/Dashboard";
import PrivateRoute from "./PrivateRoutes";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Settings from "../pages/dashboard/Settings";
import ClubDetails from "../pages/Clubdetails";
import EventsDetails from "../pages/EventsDetails";
import AddAnEvent from "../pages/dashboard/AddAnEvent";
import AddAClub from "../pages/dashboard/AddAClub";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "clubs",
        Component: Clubs,
      },
      {
        path: "clubs/:id",
        Component: ClubDetails,
      },
      {
        path: "events",
        Component: Events,
      },
      {
        path: "events/:id",
        Component: EventsDetails,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "add-an-event",
        Component: AddAnEvent,
      },
      {
        path: "add-a-club",
        Component: AddAClub,
      },
      // {
      //   path: "payment/:parcelId",
      //   element: <Payment></Payment>,
      // },
      // {
      //   path: "payment-success",
      //   Component: PaymentSuccess,
      // },
      // {
      //   path: "payment-cancelled",
      //   Component: PaymentCancelled,
      // },
      // {
      //   path: "payment-history",
      //   Component: PaymentHistory,
      // },

      // // Only ADMIN Routes
      // {
      //   path: "assign-riders",
      //   element: (
      //     <AdminRoute>
      //       <AssignRiders />
      //     </AdminRoute>
      //   ),
      // },
      // {
      //   path: "approve-riders",
      //   // Component: ApproveRider,
      //   element: (
      //     <AdminRoute>
      //       <ApproveRider></ApproveRider>
      //     </AdminRoute>
      //   ),
      // },
      // {
      //   path: "manage-users",
      //   // Component: ManageUsers,
      //   element: (
      //     <AdminRoute>
      //       <ManageUsers></ManageUsers>
      //     </AdminRoute>
      //   ),
      // },

      // // Only RIDERS Route
      // {
      //   path: "assigned-deliveries",
      //   element: (
      //     <RiderRoute>
      //       <AssignedDeliveries />
      //     </RiderRoute>
      //   ),
      // },
      // {
      //   path: "completed-deliveries",
      //   element: (
      //     <RiderRoute>
      //       <CompletedDeliveries />
      //     </RiderRoute>
      //   ),
      // },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
