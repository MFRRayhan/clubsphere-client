import { createBrowserRouter } from "react-router";
import Dashboard from "../layouts/Dashboard";
import RootLayout from "../layouts/RootLayout";
import BlogDetails from "../pages/BlogDetails";
import Blogs from "../pages/Blogs";
import ClubDetails from "../pages/ClubDetails";
import Clubs from "../pages/Clubs";
import EventDetails from "../pages/EventDetails";
import Events from "../pages/Events";
import ForgotPassword from "../pages/ForgotPassword";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import AddAClub from "../pages/dashboard/AddAClub";
import AddAnEvent from "../pages/dashboard/AddAnEvent";
import AdminManageEvents from "../pages/dashboard/AdminManageEvents";
import AllPaymentHistory from "../pages/dashboard/AllPaymentHistory";
import BeAManager from "../pages/dashboard/BeAManager";
import ClubMembers from "../pages/dashboard/ClubMembers";
import DashboardHome from "../pages/dashboard/DashboardHome";
import EventRegistrations from "../pages/dashboard/EventRegistrations";
import ManageBlogs from "../pages/dashboard/ManageBlogs";
import ManageClubs from "../pages/dashboard/ManageClubs";
import ManageEvents from "../pages/dashboard/ManageEvents";
import ManageUsers from "../pages/dashboard/ManageUsers";
import ManagerPayments from "../pages/dashboard/ManagerPayments";
import MyBlogs from "../pages/dashboard/MyBlogs";
import MyClubs from "../pages/dashboard/MyClubs";
import MyEvents from "../pages/dashboard/MyEvents";
import MyManagedClubs from "../pages/dashboard/MyManagedClubs";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import PendingBlogs from "../pages/dashboard/PendingBlogs";
import Settings from "../pages/dashboard/Settings";
import WaitingForApproval from "../pages/dashboard/WaitingForApproval";
import WriteABlog from "../pages/dashboard/WriteABlog";
import AdminRoute from "../router/AdminRoute";
import ManagerRoute from "./ManagerRoute";
import PrivateRoute from "./PrivateRoutes";

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
        // element: (
        //   <PrivateRoute>
        //     <ClubDetails />
        //   </PrivateRoute>
        // ),
        Component: ClubDetails,
      },
      {
        path: "events",
        Component: Events,
      },
      {
        path: "events/:id",
        // element: (
        //   <PrivateRoute>
        //     <EventsDetails />
        //   </PrivateRoute>
        // ),
        Component: EventDetails,
      },
      {
        path: "blogs",
        Component: Blogs,
      },
      {
        path: "blog/:id",
        Component: BlogDetails,
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
        path: "admin-manage-blogs",
        element: (
          <AdminRoute>
            <ManageBlogs />
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
        path: "pending-blogs",
        element: (
          <AdminRoute>
            <PendingBlogs />
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
        path: "my-blogs",
        element: (
          <ManagerRoute>
            <MyBlogs />
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
        path: "write-a-blog",
        element: (
          <ManagerRoute>
            <WriteABlog />
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
