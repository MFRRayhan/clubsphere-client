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
import AllPaymentHistory from "../pages/dashboard/AllPaymentHistory";
import ManagerPayments from "../pages/dashboard/ManagerPayments";
import WaitingForApproval from "../pages/dashboard/WaitingForApproval";
import AdminRoute from "../router/AdminRoute";

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
        element: (
          <PrivateRoute>
            <EventsDetails />
          </PrivateRoute>
        ),
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
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "manage-clubs",
        // Component: ManageClubs,
        element: (
          <AdminRoute>
            <ManageClubs></ManageClubs>
          </AdminRoute>
        ),
      },
      {
        path: "waiting-for-approval",
        // Component: WaitingForApproval,
        element: (
          <AdminRoute>
            <WaitingForApproval></WaitingForApproval>
          </AdminRoute>
        ),
      },
      {
        path: "all-payments",
        // Component: AllPaymentHistory,
        element: (
          <AdminRoute>
            <AllPaymentHistory></AllPaymentHistory>
          </AdminRoute>
        ),
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
        path: "payments",
        Component: PaymentHistory,
      },

      {
        path: "manager-payments",
        Component: ManagerPayments,
      },
      {
        path: "be-a-manager",
        Component: BeAManager,
      },

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
