import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline, ListItemButton,
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
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";

const drawerWidthLg = 270;
const drawerWidthMd = 240;
const drawerWidthSm = 195;

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
  ...theme.mixins.toolbar,
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
  ...(open && {
    ...openedMixin(theme, drawerWidth),
    "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface Props {
  window?: () => Window;
}

const Sidebar: React.FC<Props> = ({ window }) => {
  const theme = useTheme();
  const router = useRouter();

  const isLargeScreen = useMediaQuery('(min-width: 1680px) and (min-height: 1050px)');
  const isMediumScreen = useMediaQuery('(min-width: 1440px) and (min-height: 900px)');
  const isSmallScreen = useMediaQuery('(min-width: 1280px) and (min-height: 900px)');

  const drawerWidth = isLargeScreen ? drawerWidthLg : isMediumScreen ? drawerWidthMd : isSmallScreen ? drawerWidthSm : drawerWidthSm;

  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(open);
  };

  const drawer = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === "rtl" ? <MenuIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>

      <Box sx={{ textAlign: "center", padding: theme.spacing(2) }}>
        <Image src={'/irisLogo.png'} alt={"Iris Logo"}  style={{ width: "100%", height: "auto" }} width={100} height={10} />
      </Box>

      <List>
        {[
          {
            text: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/AdminDashboard",
          },
          {
            text: "Organizations",
            icon: <FaSlidersH />,
            path: "/AdminDashboard/controllersAdd",
          },
          { text: "Sites", icon: <FaUsers />, path: "/AdminDashboard/siteAdd" },
          { text: "AP", icon: <FaWifi />, path: "/AdminDashboard/apAdd" },
          { text: "Vistas", icon: <RiTableView />, path: "/AdminDashboard/viewPage" },
        ].map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <DrawerStyled container={container} variant="permanent" open={open} drawerWidth={drawerWidth}>
        {drawer}
      </DrawerStyled>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
};

export default Sidebar;