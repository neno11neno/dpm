import './Header.css';
import logoImg from '../../assets/img/logo.svg';
import { useState } from 'react';
import {
  AppBar, Toolbar, Button, Typography, useMediaQuery,
  Drawer, IconButton, Box, Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { empAuth, isAuthenticated, clearAuthData } = useAuth();

  const handleLogout = () => {
    clearAuthData();
    navigate('/LogoutPage');
  };

  const renderButtons = () => (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={1} alignItems="flex-start">
      {(empAuth === 'E') && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/UploadPage"
          sx={{ bgcolor: '#ff8000', fontSize: '12px' }}
          fullWidth={isMobile}
        >
          報表上傳
        </Button>
      )}
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        component={Link}
        to="/QueryPage"
        sx={{ fontSize: '12px' }}
        fullWidth={isMobile}
      >
        報表查詢
      </Button>
      {(empAuth === 'M' || empAuth === 'D') && (
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          component={Link}
          to="/ReviewPage"
          sx={{ bgcolor: '#FF359A', fontSize: '12px' }}
          fullWidth={isMobile}
        >
          待審案件查詢
        </Button>
      )}
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        fullWidth={isMobile}
      >
        登出
      </Button>
    </Stack>
  );

  return (
    <header>
      <AppBar position="static" color="white" sx={{ mt: '10px' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            className="logo-link"
            variant="h6"
            component={Link}
            to="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <img src={logoImg} alt="Logo" style={{ height: '60px', marginRight: '10px' }} />
            <div className="logo-text">央行申報管理系統</div>
          </Typography>

          {isAuthenticated && (
            isMobile ? (
              <>
                <IconButton edge="end" onClick={() => setDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                  <Box p={2} sx={{ width: 240 }}>
                    {renderButtons()}
                  </Box>
                </Drawer>
              </>
            ) : (
              <Box>{renderButtons()}</Box>
            )
          )}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
