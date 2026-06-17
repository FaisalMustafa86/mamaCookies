import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Delivery from "./pages/Delivery";
import Corporate from "./pages/Corporate";
import Events from "./pages/Events";
import Account from "./pages/Account";
import Order from "./pages/Order";
import StubPage from "./pages/StubPage";
import NotFound from "./pages/NotFound";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "delivery", element: <Delivery /> },
      { path: "corporate", element: <Corporate /> },
      { path: "events", element: <Events /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "account", element: <Account /> },
      { path: "order/:id", element: <Order /> },
      // Footer policy pages (Shipping, Refund, Privacy, Terms)
      { path: "p/:slug", element: <StubPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "orders", element: <AdminOrders /> },
    ],
  },
]);
