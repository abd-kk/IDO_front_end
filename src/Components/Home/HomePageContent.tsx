// Mui imports

import { Box, Skeleton, Stack } from "@mui/material";

// React imports

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// React Components imports

import { Quote } from "./Quote";
import { ToDoColumn } from "./ToDoColumn";

// CSS imports

import "./homePageContent.css";
import axios from "axios";

export type toDoItem = {
  toDoId: number;
  toDoTitle: string;
  toDoCategory: string;
  toDoDueDate: string;
  toDoEstimate: string;
  toDoImportance: string;
};

type databaseTaskItem = toDoItem & {
  toDoStatus: string;
};

export const HomePageContent = (props: {
  searchTerm: string | null;
  addNewTask: boolean;
  cancelNewTask: () => void;
}) => {
  const { searchTerm, addNewTask, cancelNewTask } = props;

  const [toDoTasks, settoDoTasks] = useState<toDoItem[]>([]);

  const [doingTasks, setdoingTasks] = useState<toDoItem[]>([]);

  const [doneTasks, setdoneTasks] = useState<toDoItem[]>([]);

  const [isQuoteVisible, setisQuoteVisible] = useState<boolean>(false);

  const [loadingTasks, setloadingTasks] = useState<boolean>(false);

  const toDoColumnRef = useRef<HTMLDivElement>(null!);
  const doingColumnRef = useRef<HTMLDivElement>(null!);
  const doneColumnRef = useRef<HTMLDivElement>(null!);

  const [searchedToDoTasks, setsearchedToDoTasks] = useState<toDoItem[]>([]);
  const [searchedDoingTasks, setsearchedDoingTasks] = useState<toDoItem[]>([]);
  const [searchedDoneTasks, setsearchedDoneTasks] = useState<toDoItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm !== null) {
      const filteredToDoTasks = toDoTasks.filter((task) =>
        task.toDoTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const filteredDoingTasks = doingTasks.filter((task) =>
        task.toDoTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const filteredDoneTasks = doneTasks.filter((task) =>
        task.toDoTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setsearchedToDoTasks(filteredToDoTasks);
      setsearchedDoingTasks(filteredDoingTasks);
      setsearchedDoneTasks(filteredDoneTasks);
    }
  }, [searchTerm, toDoTasks, doingTasks, doneTasks]);

  useEffect(() => {
    const userId = Cookies.get("id");

    if (userId === undefined) navigate("/Home", { replace: true });

    const getTasks = async () => {
      try {
        const token = Cookies.get("jwt");

        setloadingTasks(true);

        const res = await axios.get(
          "https://localhost:7140/api/Task?userId=" + userId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res);

        if (res.data.status === "success") {
          const tasks = res.data.data;

          const todotasks: toDoItem[] = [];
          const doingtasks: toDoItem[] = [];
          const donetasks: toDoItem[] = [];

          tasks.forEach((t: databaseTaskItem) => {
            const task = {
              toDoId: t.toDoId,
              toDoTitle: t.toDoTitle,
              toDoDueDate: t.toDoDueDate,
              toDoImportance: t.toDoImportance,
              toDoCategory: t.toDoCategory,
              toDoEstimate: t.toDoEstimate,
            };
            if (t.toDoStatus === "To Do") {
              todotasks.push(task);
            } else if (t.toDoStatus === "Doing") {
              doingtasks.push(task);
            } else {
              donetasks.push(task);
            }
          });

          settoDoTasks(todotasks);
          setdoingTasks(doingtasks);
          setdoneTasks(donetasks);
          setloadingTasks(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/Home", { replace: true });
          Cookies.remove("id");
          Cookies.remove("jwt");
        }
        console.log(error);
      }
    };

    getTasks();
  }, [navigate]);

  const showQuote = () => {
    setisQuoteVisible(true);
  };

  const hideQuote = () => {
    setisQuoteVisible(false);
  };

  // const changeTaskStatus = (props: {
  //   task: toDoItem;
  //   oldStatus: string;
  //   newStatus: string;
  // }) => {
  //   const { task, oldStatus, newStatus } = props;

  //   let oldStatusTasks, newStatusTasks;

  //   if (oldStatus === "To Do") {
  //     oldStatusTasks = Array.from(toDoTasks);
  //   } else if (oldStatus === "Doing") {
  //     oldStatusTasks = Array.from(doingTasks);
  //   } else {
  //     oldStatusTasks = Array.from(doneTasks);
  //   }

  //   if (newStatus === "To Do") {
  //     newStatusTasks = Array.from(toDoTasks);
  //   } else if (newStatus === "Doing") {
  //     newStatusTasks = Array.from(doingTasks);
  //   } else {
  //     newStatusTasks = Array.from(doneTasks);
  //   }

  //   // console.log(oldStatusTasks);
  //   // console.log(newStatusTasks);

  //   const filteredOldStatusTasks = oldStatusTasks.filter(
  //     (t) => t.toDoId !== task.toDoId
  //   );

  //   newStatusTasks.unshift(task);

  //   console.log(filteredOldStatusTasks);
  //   console.log(newStatusTasks);

  //   // if(oldStatus === "To Do") {
  //   //   settoDoTasks(filteredOldStatusTasks);
  //   // } else if(oldStatus === "Doing") {
  //   //   setdoingTasks(filteredOldStatusTasks);
  //   // } else {
  //   //   setdoneTasks(filteredOldStatusTasks);
  //   // }

  //   // if (newStatus === "To Do") {
  //   //   settoDoTasks(newStatusTasks);
  //   // } else if (newStatus === "Doing") {
  //   //   setdoingTasks(newStatusTasks);
  //   // } else {
  //   //   setdoneTasks(newStatusTasks);
  //   // }

  //   // console.log(filteredOldStatusTasks);
  //   // console.log(updatedNewStatusTasks);
  // };

  type saveTaskProps = toDoItem & {
    toDoStatus: string;
  };

  const saveTask = (item: saveTaskProps) => {
    const toDoStatus = item.toDoStatus;

    let tasks;

    if (toDoStatus === "To Do") {
      tasks = Array.from(toDoTasks);
    } else if (toDoStatus === "Doing") {
      tasks = Array.from(doingTasks);
    } else tasks = Array.from(doneTasks);

    tasks.forEach((t) => {
      if (t.toDoId === item.toDoId) {
        t.toDoTitle = item.toDoTitle;
        t.toDoCategory = item.toDoCategory;
        t.toDoDueDate = item.toDoDueDate;
        t.toDoEstimate = item.toDoEstimate;
        t.toDoImportance = item.toDoImportance;
      }
    });

    if (toDoStatus === "To Do") {
      settoDoTasks(tasks);
    } else if (toDoStatus === "Doing") {
      setdoingTasks(tasks);
    } else setdoneTasks(tasks);
  };

  return (
    <Box className="home-page-content">
      <Quote isQuoteVisible={isQuoteVisible} hideQuote={hideQuote} />
      <Box
        height="32px"
        bgcolor="#F4F7FC"
        sx={{ zIndex: "200", position: "sticky", top: "68px", left: "0" }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        columnGap={{
          xs: "5px",
          sm: "10px",
          lg: "20px",
        }}
        px={{
          xs: "2px",
          sm: "5px",
          md: "35px",
        }}
      >
        <Stack
          className="to-do-list"
          direction="row"
          columnGap={{
            xs: "2px",
            md: "10px",
          }}
        >
          {loadingTasks ? (
            <>
              <LoadingComponent />
              <LoadingComponent />
              <LoadingComponent />
            </>
          ) : (
            <>
              <ToDoColumn
                toDoColumnStatus="To Do"
                tasks={searchTerm !== null ? searchedToDoTasks : toDoTasks}
                saveTask={saveTask}
                addNewTask={addNewTask}
                changeTaskStatus={() => {}}
                cancelNewTask={cancelNewTask}
                searchTerm={searchTerm}
                toDoColumnRef={toDoColumnRef}
                doingColumnRef={doingColumnRef}
                doneColumnRef={doneColumnRef}
              />
              <ToDoColumn
                toDoColumnStatus="Doing"
                tasks={searchTerm !== null ? searchedDoingTasks : doingTasks}
                saveTask={saveTask}
                changeTaskStatus={() => {}}
                searchTerm={searchTerm}
                toDoColumnRef={toDoColumnRef}
                doingColumnRef={doingColumnRef}
                doneColumnRef={doneColumnRef}
              />
              <ToDoColumn
                toDoColumnStatus="Done"
                tasks={searchTerm !== null ? searchedDoneTasks : doneTasks}
                saveTask={saveTask}
                changeTaskStatus={() => {}}
                searchTerm={searchTerm}
                toDoColumnRef={toDoColumnRef}
                doingColumnRef={doingColumnRef}
                doneColumnRef={doneColumnRef}
              />
            </>
          )}
        </Stack>

        <Box
          display={`${isQuoteVisible ? "none" : "block"}`}
          sx={{ cursor: "pointer", position: "sticky", top: "100px" }}
          onClick={showQuote}
        >
          <img
            src="../../../public/images/Home/ShowQuoteIcon.svg"
            style={{
              position: "sticky",
              top: "100px",
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

const LoadingComponent = () => {
  return <Skeleton variant="rectangular" animation="wave" />;
};
