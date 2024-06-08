// src/components/NavBar.tsx
import React from 'react';
import { AppBar, Box, IconButton, InputBase, Menu, MenuItem, Badge, Typography, Toolbar, Avatar, Divider, ListItemIcon } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { FaBell, FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavBar: React.FC<{ handleDrawerToggle: () => void }> = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter()

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    deleteCookie('token')
    router.push('/')
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" noWrap>
          Netmask
        </Typography>
      </Box>
      <Divider />
      {/* <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <FaUser />
        </ListItemIcon>
        Perfil
      </MenuItem> */}
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <FaSignOutAlt />
        </ListItemIcon>
        Cerrar Sesión
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            {/* <IconButton size="large" aria-label="show new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <FaBell style={{ fontSize: '1.2rem' }} />
              </Badge>
            </IconButton> */}
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search> */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 30, height: 30 }}>N</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default NavBar;
