//  Mui imports

import { Box } from "@mui/material";

// React imports

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// React router imports

import { useNavigate } from "react-router-dom";

// React components imports

import { HomePageHeader } from "../../Components/Home/HomePageHeader";
import { HomePageContent } from "../../Components/Home/HomePageContent";

// CSS file import

export const HomePage = () => {
  const [addNewTask, setaddNewTask] = useState<boolean>(false);

  const [searchTerm, setsearchTerm] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    const id = Cookies.get("id");

    if (token === undefined || id === undefined) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") {
      setsearchTerm(null);
      return;
    }
    setsearchTerm(e.currentTarget.value);
  };

  const addTask = () => {
    if (addNewTask) return;
    setaddNewTask(true);
  };

  const cancelNewTask = () => {
    setaddNewTask(false);
  };

  return (
    <Box minHeight="150vh" pb="30px" bgcolor="#F4F7FC">
      <HomePageHeader
        addTask={addTask}
        handleChangeSearchTerm={handleChangeSearchTerm}
      />
      <HomePageContent
        searchTerm={searchTerm}
        addNewTask={addNewTask}
        cancelNewTask={cancelNewTask}
      />
    </Box>
  );
};
