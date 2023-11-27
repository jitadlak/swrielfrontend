import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
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
  { id: 'vendorId', label: 'Vendor ID', alignRight: false },
  { id: 'amount', label: 'Withdrawal Amount', alignRight: false },
  { id: 'approved', label: 'Approved Status', alignRight: false },

  // { id: 'approve', label: 'Approve', alignRight: false },
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
    return filter(array, (_user) => _user.serviceprovider.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function VendorWithDrawRequest() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [USERLIST, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedFile, setselectedFile] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open2, setOpen2] = useState(false);
  const [isImgUploaded, setIsImageUploaded] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [productName, setProduct] = useState('');
  const onOpenModal = () => setOpen2(true);
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
      const res = await axios.get('https://swrielapp.onrender.com/user/vendor/allrequests');
      setLoading(false);
      console.log(res, 'res');
      if (res.data.status === 400) {
        alert(res.data.message);
      } else {
        setUserList(res.data.result.reverse());
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
            Store Vendor WithDrawal Requests
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={onOpenModal}>
                        Add Products
                    </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <ClipLoader color={'blue'} loading={loading} size={30} aria-label="Loading Spinner" data-testid="loader" />
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
                    const { _id, amount, vendor, approved } = row;
                    const selectedUser = selected.indexOf(vendor) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={vendor}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, serviceprovider)} /> */}
                        </TableCell>

                        <TableCell align="left">{vendor}</TableCell>

                        <TableCell align="left">{amount}</TableCell>
                        {approved ? (
                          <TableCell align="left">APPROVED</TableCell>
                        ) : (
                          <TableCell align="left">NOT APPROVED </TableCell>
                        )}

                        {/* <TableCell align="left">
                                                    <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteFunc(_id)}>
                                                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                                                        Delete
                                                    </MenuItem>
                                                </TableCell> */}
                        {/* {approved ? <TableCell align="left">
                                                    <MenuItem onClick={() => navigate('/dashboard/serviceorderdetails', { state: row })} style={{ backgroundColor: '#ffffff' }}>
                                                        <Iconify icon={'eva:right'} sx={{ mr: 2 }} />
                                                        Approved
                                                    </MenuItem>
                                                </TableCell> : <TableCell align="left">
                                                    <MenuItem onClick={() => navigate('/dashboard/serviceorderdetails', { state: row })} style={{ backgroundColor: 'green', color: '#ffffff' }}>
                                                        <Iconify icon={'eva:right'} sx={{ mr: 2 }} />
                                                        Approve
                                                    </MenuItem>
                                                </TableCell>} */}
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
