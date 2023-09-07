import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getdownloadURl } from 'firebase/storage';
import firebase from 'firebase';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  Input,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import storage from '../urls/firebase';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SendNotification() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [id, setId] = useState('');

  const [notificationTitle, setNotificationTitle] = useState('');

  const [notificationData, setNotificationData] = useState('');

  useEffect(() => {
    // fetchUser();
    _getasync();
  }, []);
  const _getasync = async () => {
    const items = await localStorage.getItem('user_login');
    if (!items) {
      navigate('/login', { replace: false });
    }
  };

  const uploadService = async () => {
    try {
      if (!notificationTitle || !notificationData) {
        alert('Please Fill All Fields !!');
      }

      const dataobj = {
        notificationTitle,
        notificationData,
      };
      console.log(dataobj, 'data obj');
      setLoading(true);
      const res = await axios.post('https://swrielapp.onrender.com/user/sendnotificationuser', dataobj);
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        alert(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  const uploadServicevendor = async () => {
    try {
      if (!notificationTitle || !notificationData) {
        alert('Please Fill All Fields !!');
      }

      const dataobj = {
        notificationTitle,
        notificationData,
      };
      console.log(dataobj, 'data obj');
      setLoading(true);
      const res = await axios.post('https://swrielapp.onrender.com/user/sendnotificationvendor', dataobj);
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        alert(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  return (
    <>
      <Helmet>
        <title> SWRIEL ADMIN</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            SEND NOTIFICATIONS
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
                        Add App Banner
                    </Button> */}
        </Stack>

        <Card style={{ padding: 10, height: 500 }}>
          <div>
            <TextField
              name="title"
              label="Notification Title"
              onChange={(event) => setNotificationTitle(event.target.value)}
            />
            <TextField
              name="message"
              label="Notification Data"
              onChange={(event) => setNotificationData(event.target.value)}
            />
          </div>
          <div style={{ marginTop: 50 }}>
            <Button variant="contained" component="label" onClick={uploadService} style={{ marginLeft: 10 }}>
              SEND TO USER
            </Button>
            <Button variant="contained" component="label" onClick={uploadServicevendor} style={{ marginLeft: 30 }}>
              SEND TO VENDOR
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
}
