import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
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
import storage from '../urls/firebase';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productId', label: 'Product ID', alignRight: false },
  { id: 'productImage', label: 'Image', alignRight: false },
  { id: 'productName', label: 'Product', alignRight: false },
  { id: 'productPrice', label: 'Price', alignRight: false },
  { id: 'productTitle', label: 'Title', alignRight: false },
  // { id: 'productDescription', label: 'Description', alignRight: false },
  { id: 'productCompany', label: 'Product Company', alignRight: false },
  { id: 'productSubcategory', label: 'Category', alignRight: false },
  { id: 'createdAt', label: 'createdAt', alignRight: false },
  { id: 'update', label: 'Update Price', alignRight: false },
  { id: 'updateProduct', label: 'Update Product', alignRight: false },
  // { id: 'edit', label: 'Edit', alignRight: false },
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

export default function AddProdu() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [isImgUploaded, setIsImageUploaded] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [updatedId, setupdateId] = useState('');
  const [updatedProductName, setUpdatedProductName] = useState('');
  const [updatedProductTitle, setUpdatedProductTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCompany, setProductCompany] = useState('');
  const [productSubcategoryId, setProductSubcategoryId] = useState('');
  const [company, setCompany] = useState([]);
  const onOpenModal = () => setOpen2(true);
  const onCloseModal = () => setOpen2(false);
  const onOpenModal3 = (_id) => {
    setupdateId(_id);
    setOpen3(true);
  };
  const onCloseModal3 = () => {
    setupdateId('');
    setOpen3(false);
  };
  const onOpenModal4 = (_id) => {
    setupdateId(_id);
    setOpen4(true);
  };
  const onCloseModal4 = () => {
    setupdateId('');
    setOpen4(false);
  };

  useLayoutEffect(() => {
    // fetchUser();
    fetchUser2();
    fetchUser3();
    _getasync();
  }, []);

  // useEffect(() => {
  //   fetchUser();
  //   fetchUser2();
  //   fetchUser3();
  //   _getasync();
  // }, [USERLIST]);
  const _getasync = async () => {
    const items = await localStorage.getItem('user_login');
    if (!items) {
      navigate('/login', { replace: false });
    }
  };
  const fetchUser = async () => {
    try {
      setLoading1(true);
      const res = await axios.get('https://swrielapp.onrender.com/admin/allproductslists');
      console.log(res, 'res');
      setLoading1(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setUserList(res?.data?.result?.reverse());
      }
    } catch (error) {
      setLoading1(false);
      console.log(error, 'error');
    }
  };

  const fetchUser2 = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://swrielapp.onrender.com/admin/allproductcategory');
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setProductList(res.data.result);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const fetchUser3 = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://swrielapp.onrender.com/admin/allcompany');
      console.log(res, 'company');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setCompany(res.data.result);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  // const deleteFunc = async (id) => {
  //     try {
  //         const res = await axios.delete(`https://swrielapp.onrender.com/admin/deleteservicecategory/${id}`);
  //         console.log(res, 'res');
  //         if (res.data.status === 400) {
  //             alert(res.data.message);
  //         } else {
  //             fetchUser();
  //         }
  //     } catch (error) {
  //         console.log(error, 'error');
  //     }
  // };

  const onFileUpload = async () => {
    // Create an object of formData
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

  const uploadService = async () => {
    try {
      const dataobj = {
        productName,
        productImage: imagePath,
        productPrice,
        productTitle,
        productSubcategoryId,
        productDescription,
        productCompany,
      };
      console.log(dataobj, 'data obj');
      setLoading(true);
      const res = await axios.post('https://swrielapp.onrender.com/admin/addProductList', dataobj);
      setLoading(false);
      console.log(res, 'resaddcategory');
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setOpen2(false);
       
        alert('Product Added Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };

  const updatePrice = async () => {
    try {
      const data = {
        updatedId,
        newPrice,
      };

      // console.log(data, 'update balance api')
      const res = await axios.patch('https://swrielapp.onrender.com/admin/updateprice', data);
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data?.message);
      } else {
        setOpen3(false);
        fetchUser();
        setupdateId('');
        alert(res.data?.result?.message);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const updateProduct = async () => {
    setLoading(true);
    try {
      const data = {
        updatedId,
        productName: updatedProductName,
        productImage: imagePath,
        productTitle: updatedProductTitle,
      };

      // console.log(data, 'update balance api')
      const res = await axios.patch('https://swrielapp.onrender.com/admin/updateproduct', data);
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data?.message);
      } else {
        setOpen4(false);
        fetchUser();
        setupdateId('');
        setImagePath('');
        alert(res.data?.result?.message);
      }
    } catch (error) {
      console.log(error, 'error');
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
        <title> Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           ADD Product Lists
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
            Add Products
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
            {/* <ClipLoader color={'blue'} loading={loading1} size={30} aria-label="Loading Spinner" data-testid="loader" /> */}
            <Modal open={open2} onClose={onCloseModal}>
              <Stack spacing={4}>
                <Typography variant="h3" gutterBottom>
                  Add Products Lists
                </Typography>
                <TextField
                  name="ProductName"
                  label="Product Name"
                  onChange={(event) => setProductName(event.target.value)}
                />
                <TextField
                  name="Product Price"
                  label="Product Price"
                  onChange={(event) => setProductPrice(event.target.value)}
                />
                <TextField
                  name="Product Title"
                  label="Product Title"
                  onChange={(event) => setProductTitle(event.target.value)}
                />
                <TextField
                  name="Product Description"
                  label="Product Description"
                  onChange={(event) => setProductDescription(event.target.value)}
                />
                {/* <TextField name="Product Company" label="Product Company" onChange={(event) => setProductCompany(event.target.value)} /> */}

                <Typography variant="h6" gutterBottom>
                  Select Category
                </Typography>
                <select
                  name="category"
                  id="category"
                  style={{ height: 40, borderRadius: 5 }}
                  onChange={(e) => setProductSubcategoryId(e.target.value)}
                >
                  <option value=" ">Choose</option>
                  {productList.map((item, index) => {
                    return <option value={item._id}>{item.categoryName}</option>;
                  })}
                </select>
                <Typography variant="h6" gutterBottom>
                  Select Company
                </Typography>
                <select
                  name="category"
                  id="category"
                  style={{ height: 40, borderRadius: 5 }}
                  onChange={(e) => setProductCompany(e.target.value)}
                >
                  <option value=" ">Choose</option>
                  {company.map((item, index) => {
                    return <option value={item._id}>{item.companyName}</option>;
                  })}
                </select>
                <Typography variant="h6" gutterBottom>
                  Select Product Image
                </Typography>
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

            <Modal open={open3} onClose={onCloseModal3}>
              <Stack spacing={4}>
                <Typography variant="h3" gutterBottom>
                  Update Product Price
                </Typography>

                <TextField
                  name="Product Price"
                  label="Product Price"
                  onChange={(event) => setNewPrice(event.target.value)}
                />

                {/* <TextField name="Product Company" label="Product Company" onChange={(event) => setProductCompany(event.target.value)} /> */}
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
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={updatePrice}>
                  Update
                </LoadingButton>
              )}
            </Modal>
            <Modal open={open4} onClose={onCloseModal4}>
              <Stack spacing={4}>
                <Typography variant="h3" gutterBottom>
                  Update Product
                </Typography>

                <TextField
                  name="Product Name"
                  label="Product Name"
                  onChange={(event) => setUpdatedProductName(event.target.value)}
                />

                <TextField
                  name="Product Title"
                  label="Product Title"
                  onChange={(event) => setUpdatedProductTitle(event.target.value)}
                />

                {/* <TextField name="Product Company" label="Product Company" onChange={(event) => setProductCompany(event.target.value)} /> */}
              </Stack>

              <Typography variant="h6" gutterBottom>
                Select Product Image
              </Typography>
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
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={updateProduct}>
                  Update
                </LoadingButton>
              )}
            </Modal>

         
          </Scrollbar>

     
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
