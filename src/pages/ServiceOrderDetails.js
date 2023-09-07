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

export default function ServiceOrderDetails() {
  useEffect(() => {
    _getAllProvider();
  }, []);
  const [allproviderList, setallproviderList] = useState([]);
  const theme = useTheme();
  const { state } = useLocation();
  console.log(state, 'row');

  const [seviceProviderId, setServiceProviderId] = useState('');

  const _getAllProvider = async () => {
    try {
      const res = await axios.get('https://swrielapp.onrender.com/user/provider/all', {});
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

  const assignProvider = async () => {
    try {
      const data = {
        _id: state?._id,
        serviceProviderId: seviceProviderId,
      };

      // console.log(data, 'update balance api')
      const res = await axios.patch('https://swrielapp.onrender.com/admin/serviceAssign', data);
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
              <CardHeader title={'Service Order Details'} subheader={'Details'} variant="h6" />

              <Typography sx={{ mb: 1, ml: 3, mt: 5 }}>Email : {state?.userId?.email}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Name : {state?.userId?.name}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Phone : {state?.userId?.phone}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Service Date : {state?.serviceDate}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>
                Service Time : {state?.serviceTime} {state?.serviceSlot}
              </Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Address Line 1 : {state?.addressLine1}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Address Line 2 : {state?.addressLine2}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>City : {state?.city}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>State : {state?.state}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Zip Code : {state?.zipcode}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Booked Date : {state?.createdAt}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Amount : {state?.serviceAmount}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Status : {state?.serviceStatus}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Service Note : {state?.servicenote}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Assigned To : {state?.serviceProviderId}</Typography>
              <Typography sx={{ mb: 1, ml: 3 }}>Assign To Service Provider</Typography>

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

              <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                  placeholder="ENTER PROVIDER ID TO ASSIGN"
                  style={{ height: 40, width: 200 }}
                  onChange={(event) => setServiceProviderId(event.target.value)}
                />
                <LoadingButton
                  size="small"
                  type="submit"
                  variant="contained"
                  style={{ width: 100, height: 40, marginLeft: 10 }}
                  onClick={() => assignProvider()}
                >
                  Assign
                </LoadingButton>
              </div>
              <br />

              <br />

              <TableRow hover key={1} tabIndex={-1} role="checkbox" sx={{ ml: 5 }}>
                <TableCell align="left">
                  <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                    Service Booked
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                    Service Description
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="h6" sx={{ mb: 1, ml: 3 }}>
                    Service Amount
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow hover key={1} tabIndex={-1} role="checkbox" sx={{ ml: 5 }}>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.serviceSubcategoryId.map((item, index) => {
                      return (
                        <p>
                          {item.subcatagoryname}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.serviceSubcategoryId.map((item, index) => {
                      return (
                        <p>
                          {item.description}
                          <br />
                        </p>
                      );
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ mb: 1, ml: 3 }}>
                    {state?.serviceSubcategoryId.map((item, index) => {
                      return (
                        <p>
                          {' '}
                          ₹ {item.price}
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
                title: [state?.serviceStatus, state?.serviceStatus][index],
                type: `order${index + 1}`,
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
