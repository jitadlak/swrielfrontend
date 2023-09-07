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
import { MultiSelect } from 'react-multi-select-component';

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
import storage from '../urls/firebase';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'companylogo', label: 'Company Logo', alignRight: false },
  { id: 'companyid', label: 'Company Id', alignRight: false },
  { id: 'companyname', label: 'Company Name', alignRight: false },

  { id: 'editdelete', label: 'Delete', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: false },
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
    return filter(array, (_user) => _user.promoname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Companies() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [editsubcategory, setEditSubcategies] = useState([]);
  const [subcategories, setSubcategies] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [editData, setEditData] = useState('');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [isImgUploaded, setIsImageUploaded] = useState(true);

  const [promoname, setPromoName] = useState('');
  const [eCompanyName, setECompanyName] = useState('');

  const [promoImg, setPromoImg] = useState('');

  const onOpenModal = () => setOpen2(true);
  const onCloseModal = () => setOpen2(false);

  const onOpenModal3 = (data) => {
    setEditData(data);
    setECompanyName(data.companyName);
    setOpen3(true);
  };
  const onCloseModal3 = () => setOpen3(false);

  useEffect(() => {
    fetchUser();
    _getasync();
    fetchsubcategory();
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
      const res = await axios.get('https://swrielapp.onrender.com/admin/allcompany');
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

  const fetchsubcategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://swrielapp.onrender.com/admin/allproductcategory');
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        const array = [];
        res.data.result.map((item, index) => {
          return array.push({ label: item.categoryName, value: item });
        });
        // console.log(array, 'jkjk')
        setSubcategies(array);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const deleteFunc = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`https://swrielapp.onrender.com/admin/deletecompany/${id}`);
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
          setPromoImg(downloadURL);
          // console.lo(downloadURL);
        });
      }
    );
  };

  const uploadService = async () => {
    try {
      const dataobj = {
        companyName: promoname,

        companyLogo: promoImg,
        subcategories: editsubcategory,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.post('https://swrielapp.onrender.com/admin/addcompany', dataobj);
      console.log(res, 'resaddcategory');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setOpen2(false);
        fetchUser();
        alert('Company Added Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert('something went wrong');
    }
  };
  const updateCompany = async () => {
    try {
      const dataobj = {
        id: editData._id,
        companyName: eCompanyName,

        companyLogo: promoImg,
        subcategories: editsubcategory,
      };
      setLoading(true);
      console.log(dataobj, 'data obj');
      const res = await axios.patch('https://swrielapp.onrender.com/admin/editcompany', dataobj);
      console.log(res, 'resaddcategory');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data.message);
      }
      if (res.data.status === 200) {
        setOpen3(false);
        fetchUser();
        fetchsubcategory();
        setECompanyName('');
        setPromoImg('');

        alert('Company Updated Successfully');
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
        <title> ADMIN | SWRIEL </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Product Companies
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
            Add Company
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Modal open={open2} onClose={onCloseModal} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Add Company
                </Typography>
                <TextField
                  name="promoname"
                  label="Company Name"
                  onChange={(event) => setPromoName(event.target.value)}
                />
                <Typography variant="h6" gutterBottom>
                  Select SubCategories
                </Typography>
                <MultiSelect
                  options={subcategories}
                  value={editsubcategory}
                  onChange={setEditSubcategies}
                  labelledBy="Select Subcategories"
                />

                <Typography variant="h6" gutterBottom>
                  Select Company Logo
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
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={isImgUploaded}
                  onClick={uploadService}
                >
                  Add
                </LoadingButton>
              )}
            </Modal>

            <Modal open={open3} onClose={onCloseModal3} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  Update Company
                </Typography>
                <TextField
                  name="promoname"
                  label="Company Name"
                  value={eCompanyName}
                  onChange={(event) => setECompanyName(event.target.value)}
                />
                <Typography variant="h6" gutterBottom>
                  Select SubCategories
                </Typography>
                <MultiSelect
                  options={subcategories}
                  value={editsubcategory}
                  onChange={setEditSubcategies}
                  labelledBy="Select Subcategories"
                />

                <Typography variant="h6" gutterBottom>
                  Select Company Logo
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
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={updateCompany}>
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
                    const { _id, companyName, companyLogo } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={companyName}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={companyName} onChange={(event) => handleClick(event, promoname)} /> */}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <img
                              src={companyLogo}
                              alt={companyLogo}
                              style={{ height: 80, width: 80, alignSelf: 'center', margin: 10 }}
                            />
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{_id}</TableCell>
                        <TableCell align="left">{companyName}</TableCell>

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
