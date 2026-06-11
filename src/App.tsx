import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Pages
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Search } from "./pages/Search";
import { Promotions } from "./pages/Promotions";
import Contatos from "./pages/Contatos";

// Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <GoogleAnalytics />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <Products /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/promotions", element: <Promotions /> },
      { path: "/search", element: <Search /> },
      { path: "/contact", element: <Contatos /> },
    ],
  },
]);

const App = () => {
  return (
    <div className="min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
