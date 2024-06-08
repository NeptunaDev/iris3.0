// src/components/Sidebar.tsx
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, CssBaseline, AppBar } from '@mui/material';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { FaTachometerAlt, FaWifi, FaMapMarkerAlt, FaUsers, FaNetworkWired, FaSlidersH } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface Props {
  window?: () => Window;
}

const Sidebar: React.FC<Props> = ({ window }) => {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false); // Close the drawer after navigation
  };

  const drawer = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'rtl' ? <MenuIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {[
          { text: 'Dashboard', icon: <FaTachometerAlt />, path: '/AdminDashboard' },
          { text: 'Portales Cautivos', icon: <FaNetworkWired />, path: '/AdminDashboard/portalCautive' },
          { text: 'Proyectos', icon: <FaSlidersH />, path: '/AdminDashboard/controllersAdd' },
          { text: 'AP', icon: <FaWifi />, path: '/Wifi' },
          { text: 'Usuarios', icon: <FaUsers />, path: '/Usuarios' },
          { text: 'Lugares', icon: <FaMapMarkerAlt />, path: '/Lugares' },
        ].map((item, index) => (
          <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DrawerStyled
        container={container}
        variant="permanent"
        open={open}
      >
        {drawer}
      </DrawerStyled>
      <Box component="main" sx={{ flexGrow: 1, p: 1}}>
        <DrawerHeader />
      </Box>
    </Box>
  );
};

export default Sidebar;
