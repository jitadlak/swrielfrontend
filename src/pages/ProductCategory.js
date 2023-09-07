import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
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
  { id: 'productcategoryid', label: 'Product Category ID', alignRight: false },
  { id: 'categoryName', label: 'Product Category', alignRight: false },
  { id: 'productName', label: 'Product', alignRight: false },
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
    return filter(array, (_user) => _user.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductCategory() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [companyId, setCompanyId] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open2, setOpen2] = useState(false);

  const [productCategoryName, setProductCategory] = useState('');
  const [productCategoryName2, setProductCategory2] = useState('');
  const [_id, setId] = useState('');
  const [productId, setProductId] = useState('');
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
      const res = await axios.get('https://swrielapp.onrender.com/admin/allproductcategory');
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
      const res = await axios.get('https://swrielapp.onrender.com/admin/allproducts');
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setProductList(res.data.result);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const deleteFunc = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`https://swrielapp.onrender.com/admin/deleteproductcategory/${id}`);
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
        categoryName: productCategoryName,
        productId,
        companyId,
      };
      console.log(dataobj, 'data obj');
      setLoading(true);
      const res = await axios.post('https://swrielapp.onrender.com/admin/addproductcategory', dataobj);
      console.log(res, 'resaddcategory');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setProductCategory('');
        setProductId('');
        setOpen2(false);
        fetchUser();
        alert('Product Added Successfully');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert('something went wrong');
    }
  };

  const editFunction = async () => {
    try {
      const dataobj = {
        categoryName: productCategoryName2,
        _id,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.patch('https://swrielapp.onrender.com/admin/product/editcategory', dataobj);
      setLoading(false);
      console.log(res, 'resaddcategory');
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setProductCategory2('');
        setId('');

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

  const editmodalfunc = (item) => {
    setOpen(true);

    setProductCategory2(item?.categoryName);
    setId(item?._id);
  };
  const Userlist = [];
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
            Product/Category Lists
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
                  Add Product/Category
                </Typography>
                <TextField
                  name="Service"
                  label="Category Name"
                  onChange={(event) => setProductCategory(event.target.value)}
                />
                <Typography variant="h6" gutterBottom>
                  Select Service
                </Typography>
                <select
                  name="category"
                  id="category"
                  style={{ height: 40, borderRadius: 5 }}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value=" ">Choose</option>
                  {productList.map((item, index) => {
                    return <option value={item._id}>{item.productName}</option>;
                  })}
                </select>
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
                  Edit Product/Category
                </Typography>
                <TextField
                  name="Service"
                  label="Category Name"
                  onChange={(event) => setProductCategory2(event.target.value)}
                  value={productCategoryName2}
                />
                {/* <Typography variant="h6" gutterBottom>
                                    Select Service
                                </Typography>
                                <select name="category" id="category" style={{ height: 40, borderRadius: 5 }}
                                    onChange={(e) => setProductId(e.target.value)}

                                >
                                    <option value=" ">Choose</option>
                                    {productList.map((item, index) => {
                                        return <option value={item._id}>{item.productName}</option>
                                    })}
                                </select> */}
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
                    const { _id, categoryName, productId, createdAt, productData } = row;
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
                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{productData?.productName}</TableCell>
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
    </>
  );
}
