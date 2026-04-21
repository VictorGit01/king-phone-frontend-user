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

const Layout = () => {
  return (
    <div>
  <ScrollToTop />
      <Header />
      <Outlet />
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
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
