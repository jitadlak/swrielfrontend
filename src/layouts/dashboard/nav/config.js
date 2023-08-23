// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'DASHBOARD',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'USERS',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'ALL VENDORS',
    path: '/dashboard/allvendors',
    icon: icon('ic_user'),
  },
  {
    title: 'ALL SERVICE PROVIDERS',
    path: '/dashboard/allserviceprovider',
    icon: icon('ic_user'),
  },
  {
    title: 'SERVICES',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'SERVICES/CATEGORY',
    path: '/dashboard/servicecategory',
    icon: icon('ic_cart'),
  },
  {
    title: 'SERVICES/SUBCATEGORY',
    path: '/dashboard/servicesubcategory',
    icon: icon('ic_cart'),
  },
  {
    title: 'PRODUCTS',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'PRODUCTS/COMPANY',
    path: '/dashboard/companies',
    icon: icon('ic_blog'),
  },
  {
    title: 'PRODUCT/CATEGORY',
    path: '/dashboard/productcategory',
    icon: icon('ic_lock'),
  },
  {
    title: 'PRODUCT LISTS',
    path: '/dashboard/productcategorycompany',
    icon: icon('ic_lock'),
  },
  {
    title: 'PRODUCTS PROMOTIONS',
    path: '/dashboard/promotions',
    icon: icon('ic_analytics'),
  },
  {
    title: 'SERVICES PROMOTIONS',
    path: '/dashboard/servicespromotions',
    icon: icon('ic_analytics'),
  },
  {
    title: 'OFFERS',
    path: '/dashboard/offers',
    icon: icon('ic_analytics'),
  },
  {
    title: 'SERVICE BOOKING',
    path: '/dashboard/serviceorders',
    icon: icon('ic_lock'),
  },
  {
    title: 'PRODUCT BOOKING',
    path: '/dashboard/productorders',
    icon: icon('ic_lock'),
  },
  {
    title: 'SERVICE PROVIDER WITHDRAWAL REQUESTS',
    path: '/dashboard/serviceproviderrequest',
    icon: icon('ic_analytics'),
  },
  {
    title: 'VENDOR WITHDRAWAL REQUESTS',
    path: '/dashboard/vendorrequest',
    icon: icon('ic_analytics'),
  },
  {
    title: 'BANK DETAILS',
    path: '/dashboard/allbanksdetails',
    icon: icon('ic_blog'),
  },
  {
    title: 'FEEDBACKS',
    path: '/dashboard/feedbacks',
    icon: icon('ic_lock'),
  },
  {
    title: 'APP BANNERS',
    path: '/dashboard/appbanners',
    icon: icon('ic_lock'),
  },
  {
    title: 'SEND NOTIFICATIONS',
    path: '/dashboard/sendnotification',
    icon: icon('ic_blog'),
  },


  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
