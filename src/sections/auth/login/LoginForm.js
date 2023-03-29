import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SignIn } from '../../../urls/urls';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const handleClick = async () => {
    // setLoading(true);
    const data = {
      email,
      password,
    };
    console.log(data, 'data');
    try {
      const result = await axios.post('https://swrielapp.onrender.com/admin/signin', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // setLoading(false);
      console.log(result, 'result');
      if (result.data.status === 400) {
        toast(result.data.message);
      }
      if (result.data.status === 200) {
        // toast(result.data.message)
        await localStorage.setItem('user_login', JSON.stringify(result.data.result));
        navigate('/dashboard', { replace: false });
      }
    } catch (error) {
      // setLoading(false);
      console.log(error, 'error');
    }
  };
  // const handleClick = () => {
  //   // e.preventDefault();
  //   axios.post("http://localhost:3000/admin/signin", {
  //     email,
  //     password,

  //   }).then(res => {
  //     console.log(res, 'res')
  //   })
  // }

  return (
    <>


      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <ClipLoader
          color={'blue'}
          loading={loading}

          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} disabled={loading}>
        Login
      </LoadingButton>
      <ToastContainer />


    </>
  );
}
