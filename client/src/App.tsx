import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tours from "@/pages/tours";
import TourDetails from "@/pages/tours/[id]";
import CustomRequest from "@/pages/custom-request";
import Store from "@/pages/store";
import ProductDetails from "@/pages/store/[id]";
import Cart from "@/pages/store/cart";
import Checkout from "@/pages/store/checkout";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[id]";
import Login from "@/pages/auth/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTours from "@/pages/admin/tours";
import AdminProducts from "@/pages/admin/products";
import AdminBlog from "@/pages/admin/blog";
import AdminCustomRequests from "@/pages/admin/custom-requests";
import AdminOrders from "@/pages/admin/orders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tours" component={Tours} />
          <Route path="/tours/:id" component={TourDetails} />
          <Route path="/custom-request" component={CustomRequest} />
          <Route path="/store" component={Store} />
          <Route path="/store/:id" component={ProductDetails} />
          <Route path="/store/cart" component={Cart} />
          <Route path="/store/checkout" component={Checkout} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/tours" component={AdminTours} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/custom-requests" component={AdminCustomRequests} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <TooltipProvider>
      <CartProvider>
        <Router />
      </CartProvider>
    </TooltipProvider>
  );
}

export default App;
