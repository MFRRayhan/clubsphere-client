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
import ManagerRoute from "./ManagerRoute";
import Profile from "../pages/Profile";
import AdminManageEvents from "../pages/dashboard/AdminManageEvents";
import ForgotPassword from "../pages/ForgotPassword";

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
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
      {
        path: "profile",
        // Component: Profile,
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
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
      // Admin Routes
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
        path: "admin-manage-events",
        // Component: ManageClubs,
        element: (
          <AdminRoute>
            <AdminManageEvents></AdminManageEvents>
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

      /* -------------------------------------------------------------------------- */

      // club manager routes
      {
        path: "my-managed-clubs",
        // Component: MyManagedClubs,
        element: (
          <ManagerRoute>
            <MyManagedClubs></MyManagedClubs>
          </ManagerRoute>
        ),
      },
      {
        path: "club-members",
        // Component: ClubMembers,
        element: (
          <ManagerRoute>
            <ClubMembers></ClubMembers>
          </ManagerRoute>
        ),
      },
      {
        path: "manage-events",
        // Component: ManageEvents,
        element: (
          <ManagerRoute>
            <ManageEvents></ManageEvents>
          </ManagerRoute>
        ),
      },
      {
        path: "events-registration",
        // Component: EventRegistrations,
        element: (
          <ManagerRoute>
            <EventRegistrations></EventRegistrations>
          </ManagerRoute>
        ),
      },
      {
        path: "add-a-club",
        // Component: AddAClub,
        element: (
          <ManagerRoute>
            <AddAClub></AddAClub>
          </ManagerRoute>
        ),
      },
      {
        path: "add-an-event",
        // Component: AddAnEvent,
        element: (
          <ManagerRoute>
            <AddAnEvent></AddAnEvent>
          </ManagerRoute>
        ),
      },
      {
        path: "manager-payments",
        // Component: ManagerPayments,
        element: (
          <ManagerRoute>
            <ManagerPayments></ManagerPayments>
          </ManagerRoute>
        ),
      },

      /* -------------------------------------------------------------------------- */

      {
        path: "my-clubs",
        Component: MyClubs,
      },

      {
        path: "my-events",
        Component: MyEvents,
      },

      {
        path: "payments",
        Component: PaymentHistory,
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
