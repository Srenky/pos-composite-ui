import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

async function isValidUser(user: string, password: string): Promise<boolean> {
  const response = await fetch(
    `https://dpne9iqs25.execute-api.eu-north-1.amazonaws.com/login?username=${user}&password=${password}`,
  );
  return response.status === 200;
}

export default function SignInCard() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    const isValid = await isValidUser(username, password);

    if (!isValid) {
      alert('The username or password you entered is incorrect');
      return;
    }

    startTransition(() => {
      switch (username) {
        case 'backoffice':
          navigate('/backoffice', { replace: true });
          break;
        case 'kitchen':
          navigate('/kitchen', { replace: true });
          break;
        case 'checkout':
          navigate('/checkout', { replace: true });
          break;
        default:
          // alert('The username or password you entered is incorrect');
          break;
      }
    });
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            id="username"
            type="username"
            name="username"
            placeholder="Your username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handleUsernameChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handlePasswordChange}
          />
        </FormControl>
        <Button fullWidth variant="contained" onClick={handleLoginClick}>
          Sign in
        </Button>
      </Box>
    </Card>
  );
}
