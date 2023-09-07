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
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'servicesubcategoryid', label: 'Service Subcategoy ID', alignRight: false },
  { id: 'servicesubcategoryImage', label: 'Subcategory Image', alignRight: false },
  { id: 'subcatagoryname', label: 'Sub Category', alignRight: false },
  { id: 'CategoryName', label: 'Category Name', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { id: 'editdelete', label: 'Delete', alignRight: false },
  { id: 'editdelete', label: 'Edit', alignRight: false },
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
    return filter(array, (_user) => _user.subcatagoryname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ServiceSubCategory() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [orderBy, setOrderBy] = useState('name');
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open2, setOpen2] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesubCategoryName, setServicesubCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [price2, setPrice2] = useState('');
  const [_id, setId] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [updateselectedFile, setupdateselectedFile] = useState(null);
  const [description2, setDescription2] = useState('');
  const [isImgUploaded, setIsImageUploaded] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [servicesubCategoryName2, setServicesubCategory2] = useState('');
  const onOpenModal = () => setOpen2(true);
  const onCloseModal = () => setOpen2(false);
  const onCloseModal2 = () => setOpen(false);

  useEffect(() => {
    fetchUser();
    fetchUser2();
    _getasync();
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
      const res = await axios.get('https://swrielapp.onrender.com/admin/allservicesubcategory');
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
      const res = await axios.get('https://swrielapp.onrender.com/admin/allservicecategory');
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setCategoryList(res.data.result);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const deleteFunc = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`https://swrielapp.onrender.com/admin/deleteservicesubcategory/${id}`);
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

  const uploadService = async () => {
    try {
      const dataobj = {
        subcatagoryname: servicesubCategoryName,
        categoryId,
        price,
        description,
        subcategoryImage: imagePath,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.post('https://swrielapp.onrender.com/admin/category/addsubcategory', dataobj);
      setLoading(false);
      console.log(res, 'resaddcategory');
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setServicesubCategory('');
        setCategoryId('');
        setPrice('');
        setDescription('');
        setOpen2(false);
        setselectedFile('');
        setImagePath(null);
        fetchUser();
        alert('Service Subcategory Added Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  const editFunction = async () => {
    try {
      const dataobj = {
        subcatagoryname: servicesubCategoryName2,
        _id,
        price: price2,
        description: description2,
        subcategoryImage: imagePath,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.patch('https://swrielapp.onrender.com/admin/services/editsubcategory', dataobj);
      setLoading(false);
      console.log(res, 'resaddcategory');
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setServicesubCategory2('');
        setId('');
        setPrice2('');
        setDescription2('');
        setImagePath(null);
        setselectedFile('');
        setOpen(false);
        fetchUser();
        alert(res.data.result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const onFileChange = (event) => {
    // Update the state
    setselectedFile(event.target.files[0]);
  };
  const onFileChange2 = (event) => {
    // Update the state
    setselectedFile(event.target.files[0]);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const editmodalfunc = (item) => {
    setOpen(true);
    setPrice2(item?.price);
    setServicesubCategory2(item?.subcatagoryname);
    setDescription2(item?.description);
    setId(item?._id);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> SWRIEL ADMIN</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Services/Sub Category Lists
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
            Add Sub Category
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Modal open={open2} onClose={onCloseModal} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Add Service/Sub Category
                </Typography>
                <TextField
                  name="Service"
                  label="Sub Category Name"
                  onChange={(event) => setServicesubCategory(event.target.value)}
                />
                <TextField name="Service" label="Price" onChange={(event) => setPrice(event.target.value)} />
                <TextField
                  name="Service"
                  label="Description"
                  onChange={(event) => setDescription(event.target.value)}
                />
                <Typography variant="h6" gutterBottom>
                  Select Category
                </Typography>

                <select
                  name="category"
                  id="category"
                  style={{ height: 40, borderRadius: 5 }}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value=" ">Choose</option>
                  {categoryList.map((item, index) => {
                    return <option value={item._id}>{item.categoryName}</option>;
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

            <Modal open={open} onClose={onCloseModal2} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Edit Service/Sub Category
                </Typography>
                <TextField
                  name="Service"
                  label="Sub Category Name"
                  value={servicesubCategoryName2}
                  onChange={(event) => setServicesubCategory2(event.target.value)}
                />
                <TextField
                  name="Service"
                  label="Price"
                  value={price2}
                  onChange={(event) => setPrice2(event.target.value)}
                />
                <TextField
                  name="Service"
                  label="Description"
                  value={description2}
                  onChange={(event) => setDescription2(event.target.value)}
                />
                <Input onChange={onFileChange2} type="file" hidden />

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
                    const {
                      _id,
                      subcatagoryname,
                      categoryId,
                      price,
                      description,
                      createdAt,
                      categoryData,
                      subcategoryImage,
                    } = row;
                    const selectedUser = selected.indexOf(subcatagoryname) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, subcatagoryname)} /> */}
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <img src={`https://swrielapp.onrender.com/${serviceImage}`} alt={serviceImage} style={{ height: 80, width: 80, alignSelf: 'center', margin: 20 }} />
                                                    </Stack>
                                                </TableCell> */}
                        <TableCell align="left">{_id}</TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {subcategoryImage ? (
                              <img
                                src={subcategoryImage}
                                alt={subcategoryImage}
                                style={{ height: 80, width: 80, alignSelf: 'center', margin: 20 }}
                              />
                            ) : (
                              <h6>NO IMAGE FOUND</h6>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{subcatagoryname}</TableCell>
                        <TableCell align="left">{categoryData?.categoryName}</TableCell>
                        <TableCell align="left">{price} ₹</TableCell>
                        <TableCell align="left">{description}</TableCell>
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
                          <MenuItem onClick={() => editmodalfunc(row)}>
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

      {/* <Popover
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
            </Popover> */}
    </>
  );
}
