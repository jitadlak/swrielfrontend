import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import ClipLoader from 'react-spinners/ClipLoader';
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
} from '@mui/material';
// components
import { LoadingButton } from '@mui/lab';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vendorId', label: 'Vendor ID', alignRight: false },
  { id: 'ownername', label: 'Owner Name', alignRight: false },
  { id: 'storename', label: 'Store Name', alignRight: false },
  { id: 'storecontactno', label: 'Store Contact No.', alignRight: false },
  { id: 'storeaddress', label: 'Store Address', alignRight: false },
  { id: 'email', label: 'Owner Email', alignRight: false },
  { id: 'phone', label: 'Owner Phone', alignRight: false },
  { id: 'storemembership', label: 'Membership', alignRight: false },

  { id: 'wallet', label: 'Wallet Balance', alignRight: false },
  { id: 'options', label: 'Options', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AllVendors() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [open2, setOpen2] = useState(false);
  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [comment, setComment] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const onOpenModal = (id) => {
    setVendorId(id);
    setOpen2(true);
  };
  const onCloseModal = () => setOpen2(false);
  useEffect(() => {
    fetchUser();
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
      const res = await axios.get('https://swrielapp.onrender.com/user/vendor/all');
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

  const updatebalance = async () => {
    try {
      const data = {
        walletBalance: updatedAmount,
        _id: vendorId,
        comment,
      };

      // console.log(data, 'update balance api')
      setLoading(true);
      const res = await axios.patch('https://swrielapp.onrender.com/user/updatewalletvendor', data);
      console.log(res, 'res');
      setLoading(false);
      if (res.data.status === 400) {
        alert(res.data?.message);
        onCloseModal();
      } else {
        alert(res?.data?.result?.message);
        fetchUser();
        onCloseModal();
      }
    } catch (error) {
      setLoading(false);
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

  const Userlist = [];
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            ALL VENDORS
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Modal open={open2} onClose={onCloseModal} center>
              <Stack spacing={3}>
                <Typography variant="h3" gutterBottom>
                  UPDATE BALANCE
                </Typography>
                <TextField
                  name="ENTER UPDATED AMOUNT"
                  label="ENTER UPDATED AMOUNT"
                  onChange={(event) => setUpdatedAmount(event.target.value)}
                />
                <TextField
                  name="ENTER COMMENT"
                  label="ENTER COMMENT"
                  onChange={(event) => setComment(event.target.value)}
                />
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
              </Stack>

              <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => updatebalance()}>
                Update
              </LoadingButton>
              <ClipLoader
                color={'blue'}
                loading={loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
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
                      name,
                      email,
                      phone,
                      address,
                      membership,
                      storeaddress,
                      storecontactno,
                      storename,
                      walletBalance,
                    } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>

                        <TableCell align="left">{_id}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{storename}</TableCell>

                        <TableCell align="left">{storecontactno}</TableCell>
                        <TableCell align="left">{storeaddress}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{phone}</TableCell>

                        <TableCell align="left">{membership}</TableCell>
                        <TableCell align="left">{walletBalance} ₹</TableCell>

                        <TableCell align="right">
                          <MenuItem onClick={() => navigate('/dashboard/vendorproductlist', { state: row })}>
                            View Products
                          </MenuItem>

                          <MenuItem onClick={() => onOpenModal(_id)}>Update Balance</MenuItem>
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
      {/* 
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
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} onClick={() => navigate('/dashboard/vendorproductlist', { state: row })} />
                    View Products
                </MenuItem>
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Update Balance
                </MenuItem>

            </Popover> */}
    </>
  );
}
