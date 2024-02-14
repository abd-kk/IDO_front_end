// Mui imports
import { Stack, Box, Typography, Snackbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// React imports
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { SnackbarAlert } from "../../Components/custom snack bar/SnackbarAlert";

// React router imports
import { useNavigate } from "react-router-dom";

// CSS file import
import "./loginPage.css";

export const LoginPage = () => {
  return (
    <Stack
      className="login-page"
      direction={{ xs: "column", md: "row" }}
      minHeight="100vh"
    >
      <LogoSide />
      <LogInSide />
    </Stack>
  );
};

const LogoSide = () => {
  return (
    <Stack
      className="logo-side"
      sx={{
        flex: "1",
        height: "auto",
        mt: {
          xs: "40px",
          md: "150px",
        },
        overflow: "hidden",
      }}
      rowGap={{
        xs: "20px",
        md: "0px",
      }}
      justifyContent="space-between"
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        flex={1}
        overflow="hidden"
        textAlign="center"
      >
        <img
          className="logo"
          src="../../../public/images/Logo/Logo.png"
          alt="logo"
        />
      </Stack>
      <Stack
        flex={1}
        direction="row"
        justifyContent={{
          xs: "space-evenly",
          md: "space-between",
        }}
        alignItems="flex-end"
      >
        <img
          className="woman"
          src="../../public/images/Woman.svg"
          alt="woman"
        />
        <img className="man" src="../../public/images/Man.svg" alt="man" />
      </Stack>
    </Stack>
  );
};

const LogInSide = () => {
  const [enteredEmail, setenteredEmail] = useState<string>("");
  const [enteredPassword, setenteredPassword] = useState<string>("");

  const [invalidEmail, setinvalidEmail] = useState<boolean>(false);
  const [incorrectPassword, setincorrectPassword] = useState<boolean>(false);

  const [loadingAuthentication, setloadingAuthentication] =
    useState<boolean>(false);

  const [serverError, setserverError] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSignIn = () => {
    let validCredentials = true;

    const regex = /[a-z0-9]\w+@\w+\.\w+/;

    if (!regex.test(enteredEmail)) {
      setinvalidEmail(true);
      validCredentials = false;
    } else setinvalidEmail(false);

    if (enteredPassword === "") {
      setincorrectPassword(true);
      validCredentials = false;
    }

    if (!validCredentials) return;

    confirmData();
  };

  const confirmData = async () => {
    try {
      const inputs = {
        emailAddress: enteredEmail,
        password: enteredPassword,
      };

      setloadingAuthentication(true);

      const res = await axios.post(
        "https://localhost:7140/api/Authentication/login",
        inputs
      );

      setloadingAuthentication(false);

      if (res.data.message === "success") {
        const { userId, token } = res.data;

        console.log(token);

        setincorrectPassword(false);
        setinvalidEmail(false);
        Cookies.set("id", userId);
        Cookies.set("jwt", token);
        navigate("/Home");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setloadingAuthentication(false);

      if (error.response.data === "incorrect password") {
        setincorrectPassword(true);
      } else if (error.response.data === "user not found") {
        setinvalidEmail(true);
        setincorrectPassword(true);
      } else {
        setserverError(true);
      }
    }
  };

  return (
    <Stack
      className="login-side"
      justifyContent="center"
      alignItems="center"
      sx={{
        flex: "1",
        height: "auto",
        pt: {
          xs: "40px",
          md: "0px",
        },
      }}
      overflow="hidden"
    >
      <Box
        className="fields-container"
        textAlign={{
          xs: "center",
          md: "left",
        }}
        px={1}
      >
        <Typography
          className="time-to-work"
          color="#FFFFFF"
          sx={{
            font: "normal normal 100 72px/81px 'HelveticaNeue' , sans-serif",
          }}
          mt={{
            xs: "30px",
            md: "0px",
          }}
        >
          Time to Work!
        </Typography>
        <form onSubmit={handleSignIn}>
          <Stack mt="41px" color="white">
            <label
              style={{
                fontSize: "16px",
                height: "24px",
                font: "normal normal 300 16px/24px 'HelveticaNeue' , sans-serif",
                textAlign: "left",
              }}
            >
              Email
            </label>
            <input
              onChange={(e) => setenteredEmail(e.currentTarget.value)}
              className="email-field"
            />
          </Stack>

          <Typography
            height="16px"
            mt="5px"
            fontSize="14px"
            sx={{
              color: "#DC3545",
              font: "normal normal bold 14px/21px 'HelveticaNeue' , sans-serif",
              opacity: invalidEmail ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              textAlign: "left",
            }}
          >
            {invalidEmail && "Invalid Email"}
          </Typography>

          <Stack mt="20px" color="white">
            <label
              style={{
                fontSize: "16px",
                height: "24px",
                font: "normal normal 300 16px/24px 'HelveticaNeue' , sans-serif",
                textAlign: "left",
              }}
            >
              Password
            </label>
            <input
              onChange={(e) => setenteredPassword(e.currentTarget.value)}
              type="password"
              className="password-field"
            />
          </Stack>
          <Typography
            height="16px"
            mt="5px"
            fontSize="14px"
            sx={{
              color: "#DC3545",
              font: "normal normal bold 14px/21px 'HelveticaNeue' , sans-serif",
              opacity: incorrectPassword ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              textAlign: "left",
            }}
            mb="30px"
          >
            {incorrectPassword && "Incorrect Password"}
          </Typography>
          <LoadingButton onClick={handleSignIn} className="sign-in-button">
            {loadingAuthentication ? (
              <div className="loading-indicator">
                <div id="loading"></div>
              </div>
            ) : (
              <> SIGN IN</>
            )}
          </LoadingButton>
        </form>
      </Box>

      <Snackbar
        open={serverError}
        autoHideDuration={3000}
        onClose={() => setserverError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <SnackbarAlert
          onClose={() => setserverError(false)}
          severity="error"
          sx={{ padding: "12px 15px", fontSize: "17px" }}
        >
          Unexpected Error
        </SnackbarAlert>
      </Snackbar>
    </Stack>
  );
};
