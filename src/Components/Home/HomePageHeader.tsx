// Mui imports

import { Box, Stack, Menu, Typography, Tooltip } from "@mui/material";

// React imports

import { useRef, useState } from "react";
import Cookies from "js-cookie";

// Reat router imports

import { useNavigate } from "react-router-dom";

// CSS file import
import "./homePageHeader.css";

export const HomePageHeader = (props: {
  addTask: () => void;
  handleChangeSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { addTask, handleChangeSearchTerm } = props;

  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const searchInputElement = useRef<HTMLInputElement>(null!);

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setanchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setanchorEl(null);
  };

  const logout = () => {
    Cookies.remove("id");
    Cookies.remove("jwt");
    navigate("/", { replace: true });
  };

  const handleAddItem = () => {
    document.documentElement.scrollTop = 0;
    addTask();
  };

  return (
    <Box
      className="home-page-header"
      sx={{
        position: "sticky",
        left: "0",
        top: "0",
        width: "100%",
        height: "68px",
        bgcolor: "#FFFFFF",
        boxShadow: "0px 1px 4px #15223214",
        zIndex: "1300",
      }}
    >
      <Stack
        className="header-content"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: {
            xs: "15px",
            sm: "25px",
            md: "35px",
          },
          py: "4px",
        }}
      >
        <img
          height="60px"
          src="../../../public/images/Logo/Logo.png"
          style={{ cursor: "pointer" }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="search-items-container"
        >
          <input
            className={`search-field`}
            ref={searchInputElement}
            placeholder="What are you looking for?"
            onChange={handleChangeSearchTerm}
          />
          <img
            className="search-icon"
            width="25px"
            src="../../../public/images/Home/Search.svg"
            style={{ cursor: "pointer", transform: "translateX(-40px)" }}
          />
          <Tooltip
            title="Add Item"
            placement="bottom-end"
            enterDelay={100}
            leaveDelay={200}
          >
            <Box
              onClick={handleAddItem}
              sx={{
                ml: {
                  xs: "-7px",
                  sm: "5px",
                },
                width: "25px",
                height: "25px",
                backgroundImage:
                  "url('../../../public/images/Home/Circle.svg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <img
                src="../../../public/images/Home/Add.svg"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50% , -50%)",
                }}
              />
            </Box>
          </Tooltip>

          <Box
            onClick={openProfileMenu}
            sx={{
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              ml: {
                xs: "20px",
                sm: "30px",
              },
            }}
          >
            <img src="../../../public/images/Home/Bitmap.png" />
          </Box>
        </Stack>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeProfileMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          boxShadow: "0px 3px 6px #00000029",
        }}
      >
        <Stack
          direction="row"
          columnGap="20px"
          p={{ xs: "12px", sm: "15px", md: "20px" }}
        >
          <Box sx={{ overflow: "hidden", borderRadius: "18px" }}>
            <img src="../../../public/images/Home/Bitmap.png" width="69px" />
          </Box>
          <Stack flex="1" alignItems="center">
            <Typography
              variant="subtitle1"
              mb="10px"
              sx={{
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                },
                width: "fit-content",
                color: "#6E4C85",
              }}
            >
              abdallahkorhani1@gmail.com
            </Typography>
            <Stack
              direction="row"
              columnGap="10px"
              alignItems="center"
              onClick={logout}
              px="20px"
              sx={{
                cursor: "pointer",
                transition: ".6s",
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: "#eee",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                  },
                  color: "#212529",
                }}
              >
                Log Out
              </Typography>
              <img
                src="../../../public/images/Home/Icon ionic-ios-log-out.svg"
                alt=""
              />
            </Stack>
          </Stack>
        </Stack>
      </Menu>
    </Box>
  );
};
