// src/components/NavBar.tsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Toolbar,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { FaSignOutAlt } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  id: string;
  name: string;
  iat: number;
  exp: number;
}

const NavBar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter();
  const token = getCookie("token");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (typeof token === "string") {
      const decoded = jwtDecode<MyJwtPayload>(token);
      setName(decoded.name);
    }
  }, [token]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      slotProps={{
        paper: {
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Cuenta
        </Typography>
        <Typography variant="body1" fontWeight={600} noWrap>
          {name || "Usuario"}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        onClick={handleLogout}
        sx={{
          py: 1.5,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <FaSignOutAlt style={{ fontSize: "1rem" }} />
        </ListItemIcon>
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: "primary.main",
          borderBottom: "1px solid",
          borderColor: "primary.dark",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="abrir menú"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="medium"
            edge="end"
            aria-label="cuenta del usuario"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Avatar sx={{ width: 36, height: 36, fontSize: "0.95rem" }}>
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default NavBar;
