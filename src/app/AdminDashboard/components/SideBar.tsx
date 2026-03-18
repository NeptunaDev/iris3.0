"use client";

import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  ListItemButton,
  Typography,
} from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  FaTachometerAlt,
  FaWifi,
  FaUsers,
  FaSlidersH,
} from "react-icons/fa";
import { RiTableView } from "react-icons/ri";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

/** Debe coincidir con DRAWER_WIDTH_OPEN en layout.tsx para evitar hueco gris */
const DRAWER_WIDTH_OPEN = 240;

const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  minHeight: 56,
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
  drawerWidth: number;
}>(({ theme, open, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    borderRight: "1px solid",
    borderColor: "divider",
    boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
    bgcolor: "#fff",
  },
  ...(open && {
    ...openedMixin(theme, drawerWidth),
    "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const navItems = [
  { text: "Dashboard", icon: <FaTachometerAlt />, path: "/AdminDashboard" },
  {
    text: "Organizations",
    icon: <FaSlidersH />,
    path: "/AdminDashboard/controllersAdd",
  },
  { text: "Sites", icon: <FaUsers />, path: "/AdminDashboard/siteAdd" },
  { text: "AP", icon: <FaWifi />, path: "/AdminDashboard/apAdd" },
  { text: "Vistas", icon: <RiTableView />, path: "/AdminDashboard/viewPage" },
];

interface SideBarProps {
  window?: () => Window;
  open?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({
  window: windowProp,
  open: controlledOpen = true,
  onToggle,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const drawerWidth = DRAWER_WIDTH_OPEN;

  const open = controlledOpen;
  const handleDrawerToggle = () => onToggle?.();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const drawer = (
    <>
      <DrawerHeader>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="toggle drawer"
          sx={{ color: "text.secondary" }}
        >
          <MenuIcon />
        </IconButton>
      </DrawerHeader>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Image
          src="/irisLogo.png"
          alt="Iris Logo"
          style={{ width: "100%", height: "auto", maxWidth: 140 }}
          width={140}
          height={36}
        />
        {open && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, fontWeight: 500 }}
          >
            Analytics by Neptuna
          </Typography>
        )}
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/AdminDashboard" && pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: open ? 2 : 1.25,
                justifyContent: open ? "flex-start" : "center",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1.5 : 0,
                  color: isActive ? "primary.contrastText" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  const container =
    windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <DrawerStyled
        container={container}
        variant="permanent"
        open={open}
        drawerWidth={drawerWidth}
      >
        {drawer}
      </DrawerStyled>
      <Box component="div" sx={{ flexGrow: 1 }} aria-hidden />
    </Box>
  );
};

export default Sidebar;
