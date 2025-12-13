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
import ClubDetails from "../pages/ClubDetails";
import EventsDetails from "../pages/EventsDetails";
import AddAnEvent from "../pages/dashboard/AddAnEvent";
import AddAClub from "../pages/dashboard/AddAClub";
import ClubMembers from "../pages/dashboard/ClubMembers";
import ManageEvents from "../pages/dashboard/ManageEvents";
import EventRegistrations from "../pages/dashboard/EventRegistrations";
import ManageUsers from "../pages/dashboard/ManageUsers";
import ManageClubs from "../pages/dashboard/ManageClubs";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import BeAManager from "../pages/dashboard/BeAManager";
import MyClubs from "../pages/dashboard/MyClubs";
import MyEvents from "../pages/dashboard/MyEvents";
import MyManagedClubs from "../pages/dashboard/MyManagedClubs";

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
        element: (
          <PrivateRoute>
            <ClubDetails />
          </PrivateRoute>
        ),
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
      {
        path: "my-clubs",
        Component: MyClubs,
      },
      {
        path: "my-managed-clubs",
        Component: MyManagedClubs,
      },
      {
        path: "my-events",
        Component: MyEvents,
      },
      {
        path: "club-members",
        Component: ClubMembers,
      },
      {
        path: "manage-events",
        Component: ManageEvents,
      },
      {
        path: "events-registration",
        Component: EventRegistrations,
      },
      {
        path: "manage-users",
        Component: ManageUsers,
      },
      {
        path: "manage-clubs",
        Component: ManageClubs,
      },
      {
        path: "payments",
        Component: PaymentHistory,
      },
      {
        path: "be-a-manager",
        Component: BeAManager,
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
