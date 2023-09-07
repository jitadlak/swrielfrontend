import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
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
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'servicecategoryid', label: 'Service Category ID', alignRight: false },
  { id: 'serviceCategoryImage', label: 'Image', alignRight: false },
  { id: 'categoryName', label: 'Category', alignRight: false },
  { id: 'serviceName', label: 'Service', alignRight: false },
  { id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { id: 'editdelete', label: 'Delete', alignRight: false },
  { id: 'edit', label: 'edit', alignRight: false },

  // { id: 'email', label: 'Email', alignRight: false },
  // { id: 'phone', label: 'Phone', alignRight: false },
  // { id: 'address', label: 'Address', alignRight: false },
  // { id: 'city', label: 'City', alignRight: false },
  // { id: 'state', label: 'State', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ServiceCategory() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [id, setId] = useState('');
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [isImgUploaded, setIsImageUploaded] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [serviceCategoryName, setServiceCategory] = useState('');
  const [serviceId, setServiceId] = useState('');
  const onOpenModal = () => setOpen2(true);
  const onCloseModal = () => setOpen2(false);
  const onOpenModal3 = (data) => {
    setServiceCategory(data.categoryName);
    setId(data?._id);
    setOpen3(true);
  };
  const onCloseModal3 = () => setOpen3(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    _getasync();
    fetchUser2();
  }, []);
  const _getasync = async () => {
    const items = await localStorage.getItem('user_login');
    if (!items) {
      navigate('/login', { replace: false });
    }
  };
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://swrielapp.onrender.com/admin/allservicecategory');
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setUserList(res.data.result);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const fetchUser2 = async () => {
    try {
      const res = await axios.get('https://swrielapp.onrender.com/admin/allservices');
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setServiceList(res.data.result);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const deleteFunc = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`https://swrielapp.onrender.com/admin/deleteservicecategory/${id}`);
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        fetchUser();
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const onFileUpload = async () => {
    setLoading(true);
    const storageRef = firebase.storage().ref(`images/${selectedFile.name}`);
    const uploadTask = storageRef.put(selectedFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        setLoading(false);
        // Handle unsuccessful uploads
        alert(error);
      },
      () => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          alert('Image Uploaded');
          setLoading(false);
          setIsImageUploaded(false);
          setImagePath(downloadURL);
          // console.lo(downloadURL);
        });
      }
    );
  };
  const editFunction = async () => {
    try {
      const dataobj = {
        categoryName: serviceCategoryName,
        id,
        serviceCategoryImage: imagePath,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.patch('https://swrielapp.onrender.com/admin/services/editcategory', dataobj);
      setLoading(false);
      console.log(res, 'resaddcategory');
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setId('');
        setServiceCategory('');
        setImagePath(null);
        setselectedFile('');
        setOpen3(false);
        fetchUser();
        alert(res.data.result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  const uploadService = async () => {
    if (!serviceCategoryName && !serviceId) {
      alert('Category Name & Service Required');
    }

    try {
      const dataobj = {
        categoryName: serviceCategoryName,
        serviceId,
        serviceCategoryImage: imagePath,
      };
      console.log(dataobj, 'data obj');
      setLoading(true);
      const res = await axios.post('https://swrielapp.onrender.com/admin/addcategory', dataobj);
      console.log(res, 'resaddcategory');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setServiceCategory('');
        setServiceId('');
        setOpen2(false);
        fetchUser();
        alert('Service Added Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const Userlist = [];
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const onFileChange = (event) => {
    // Update the state
    setselectedFile(event.target.files[0]);
  };
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Services/Category Lists
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
            Add Category
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Modal open={open2} onClose={onCloseModal} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Add Service/Category
                </Typography>
                <TextField
                  name="Service"
                  label="Category Name"
                  onChange={(event) => setServiceCategory(event.target.value)}
                />
                <Typography variant="h6" gutterBottom>
                  Select Service
                </Typography>
                <select
                  name="category"
                  id="category"
                  style={{ height: 40, borderRadius: 5 }}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  <option value=" ">Choose</option>
                  {serviceList.map((item, index) => {
                    return <option value={item._id}>{item.serviceName}</option>;
                  })}
                </select>
                <Input onChange={onFileChange} type="file" hidden />
                {loading ? (
                  <ClipLoader
                    color={'blue'}
                    loading={loading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <Button variant="contained" component="label" onClick={onFileUpload}>
                    Upload File
                  </Button>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
              </Stack>

              {loading ? (
                <ClipLoader
                  color={'blue'}
                  loading={loading}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={uploadService}>
                  Add
                </LoadingButton>
              )}
            </Modal>
            <Modal open={open3} onClose={onCloseModal3} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Update Service/Category
                </Typography>
                <TextField
                  name="Service"
                  label="Category Name"
                  value={serviceCategoryName}
                  onChange={(event) => setServiceCategory(event.target.value)}
                />

                <Input onChange={onFileChange} type="file" hidden />
                {loading ? (
                  <ClipLoader
                    color={'blue'}
                    loading={loading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <Button variant="contained" component="label" onClick={onFileUpload}>
                    Upload File
                  </Button>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                {/* <Checkbox name="remember" label="Remember me" />
      <Link variant="subtitle2" underline="hover">
        Forgot password?
      </Link> */}
              </Stack>

              {loading ? (
                <ClipLoader
                  color={'blue'}
                  loading={loading}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={editFunction}>
                  Update
                </LoadingButton>
              )}
            </Modal>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, categoryName, serviceId, createdAt, serviceData, serviceCategoryImage } = row;
                    const selectedUser = selected.indexOf(categoryName) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, categoryName)} /> */}
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <img src={`https://swrielapp.onrender.com/${serviceImage}`} alt={serviceImage} style={{ height: 80, width: 80, alignSelf: 'center', margin: 20 }} />
                                                    </Stack>
                                                </TableCell> */}
                        <TableCell align="left">{_id}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {serviceCategoryImage ? (
                              <img
                                src={serviceCategoryImage}
                                alt={serviceCategoryImage}
                                style={{ height: 80, width: 80, alignSelf: 'center', margin: 20 }}
                              />
                            ) : (
                              <h6>NO IMAGE FOUND</h6>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{serviceData?.serviceName}</TableCell>
                        <TableCell align="left">{createdAt}</TableCell>
                        {/* <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">{city}</TableCell>
                        <TableCell align="left">{state}</TableCell> */}

                        <TableCell align="left">
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteFunc(_id)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Delete
                          </MenuItem>
                        </TableCell>
                        <TableCell align="left">
                          <MenuItem onClick={() => onOpenModal3(row)}>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Edit
                          </MenuItem>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => alert('hhihih')}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
