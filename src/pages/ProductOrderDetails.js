import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  CardHeader,
  Card,
  Tab,
  TableCell,
  TableRow,
  MenuItem,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/iconify';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

import { getAllServiceProviderUrl } from '../urls/urls';

// ----------------------------------------------------------------------

export default function ProductOrderDetails() {
  useEffect(() => {
    _getAllProvider();
  }, []);
  const [allproviderList, setallproviderList] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const theme = useTheme();
  const { state } = useLocation();

  const _getAllProvider = async () => {
    try {
      const res = await axios.get('https://swrielapp.onrender.com/user/vendor/all', {});
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setallproviderList(res.data.result);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const assignvendor = async () => {
    try {
      const data = {
        _id: state?._id,
        assignTo: vendorId,
      };

      // console.log(data, 'update balance api')
      const res = await axios.patch('https://swrielapp.onrender.com/admin/productAssign', data);
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data?.message);
      } else {
        alert(res.data?.result?.message);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Swriel Admin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title={'Product Order Details'} subheader={''} variant="h6" style={{ marginBottom: 30 }} />

              <Typography sx={{ mb: 1, ml: 3 }}>Name : {state?.user?.name}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Phone : {state?.user.phone}</Typography>

              <Typography sx={{ mb: 1, ml: 3 }}>Address Line 1 : {state?.addressLine1}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Address Line 2 : {state?.addressLine2}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>City : {state?.city}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>State : {state?.state}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Zip Code : {state?.zipcode}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Total Quantity : {state?.TotalQuantity}</Typography>

              <Typography sx={{ mb: 1, ml: 3 }}>Amount : {state?.TotalAmount} ₹</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>
                Payment Status : {state?.paymentId === 0 ? 'Pending/Failed' : 'Success'}
              </Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>DeliveryFee : {state?.DeliveryFee} ₹</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Delivery Note : {state?.deliveryNote}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Promocode Applied : {state?.promocodeApplied}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Service Provider ID : {state?.serviceProviderId}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Assigned To : {state?.assignTo}</Typography>
              {state.latitude && state.longitude ? (
                <LoadingButton
                  size="small"
                  type="submit"
                  variant="contained"
                  style={{ width: 200, height: 40, marginLeft: 20, marginBottom: 20 }}
                  // onClick={uploadService}
                >
                  <a
                    style={{ display: 'table-cell', textDecoration: 'none', color: '#ffffff' }}
                    href={`http://maps.google.com/?q=${state.latitude},${state.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Location On Map
                  </a>
                </LoadingButton>
              ) : null}
              <Typography sx={{ mb: 1, ml: 3 }} style={{ marginTop: 20 }}>
                Assign To Vendor
              </Typography>

              <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                  placeholder="ENTER VENDOR ID TO ASSIGN"
                  style={{ height: 40, width: 200 }}
                  onChange={(event) => setVendorId(event.target.value)}
                />
                <LoadingButton
                  size="small"
                  type="submit"
                  variant="contained"
                  style={{ width: 100, height: 40, marginLeft: 10 }}
                  onClick={() => assignvendor()}
                >
                  Assign
                </LoadingButton>
              </div>
              <br />

              <br />

              {/* 
                            <TableRow hover key={1} tabIndex={-1} role="checkbox" sx={{ ml: 5 }}>
                                <TableCell align="left">
                                    <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                                        Product ID
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                                        Product Name
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                                        Product Title
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                                        Quantity
                                    </Typography>
                                </TableCell>
                            </TableRow> */}
              <TableRow hover key={1} tabIndex={-1} role="checkbox" sx={{ ml: 5 }}>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.order.map((item, index) => {
                      return (
                        <p>
                          {' '}
                          Product ID : {item._id}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>

                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.order.map((item, index) => {
                      return (
                        <p>
                          {' '}
                          Product Name : {item.productName}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.order.map((item, index) => {
                      return (
                        <p>
                          {' '}
                          Product Title : {item.productTitle}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.order.map((item, index) => {
                      return (
                        <p>
                          {' '}
                          Quantity : {item.quantity}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Status"
              list={[...Array(2)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [state?.deliveryStatus, state?.deliveryStatus][index],
                type: `order${index + 1}`,
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
