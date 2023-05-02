import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ServiceCategory from './pages/ServiceCategory';
import ServiceSubCategory from './pages/ServiceSubCategory';
import ProductCategory from './pages/ProductCategory';
import ProductCategoryCompany from './pages/ProductCategoryCompany';
import Promotions from './pages/Promotions';
import ServiceOrders from './pages/ServiceOrders';
import ServiceOrderDetails from './pages/ServiceOrderDetails';
import ProductOrders from './pages/ProductOrders';
import ProductOrderDetails from './pages/ProductOrderDetails';
import ServiceProviderWithDrawRequest from './pages/ServiceProviderWithDrawRequest';
import VendorWithDrawRequest from './pages/VendorWithDrawRequest';
import AllVendors from './pages/AllVendors';
import AllServiceProvider from './pages/AllServiceProvider';
import VendorProductList from './pages/VendorProductList';
import Feedbacks from './pages/Feedbacks';
import AppBanner from './pages/AppBanner';
import AllBanksDetails from './pages/AllBanksDetails';
import Offers from './pages/Offers';
import Companies from './pages/Companies';
import SendNotification from './pages/SendNotification';


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'allvendors', element: <AllVendors /> },
        { path: 'allserviceprovider', element: <AllServiceProvider /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'servicecategory', element: <ServiceCategory /> },
        { path: 'servicesubcategory', element: <ServiceSubCategory /> },
        { path: 'productcategory', element: <ProductCategory /> },
        { path: 'companies', element: <Companies /> },
        { path: 'productcategorycompany', element: <ProductCategoryCompany /> },
        { path: 'promotions', element: <Promotions /> },
        { path: 'serviceorders', element: <ServiceOrders /> },
        { path: 'serviceorderdetails', element: <ServiceOrderDetails /> },
        { path: 'productorders', element: <ProductOrders /> },
        { path: 'productorderdetails', element: <ProductOrderDetails /> },
        { path: 'serviceproviderrequest', element: <ServiceProviderWithDrawRequest /> },
        { path: 'vendorrequest', element: <VendorWithDrawRequest /> },
        { path: 'vendorproductlist', element: <VendorProductList /> },
        { path: 'feedbacks', element: <Feedbacks /> },
        { path: 'appbanners', element: <AppBanner /> },
        { path: 'allbanksdetails', element: <AllBanksDetails /> },
        { path: 'offers', element: <Offers /> },
        { path: 'sendnotification', element: <SendNotification /> },
      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
