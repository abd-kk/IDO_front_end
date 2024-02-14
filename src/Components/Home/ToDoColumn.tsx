// Mui imports

import { Stack, Typography } from "@mui/material";

// react imports

import { RefObject } from "react";

// react components imports

import { ToDoItem } from "./ToDoItem";
import { toDoItem } from "./HomePageContent";

type toDoColumnProps = {
  tasks: toDoItem[];
  addNewTask?: boolean;
  cancelNewTask?: () => void;
  saveTask: (item: saveTaskProps) => void;
  changeTaskStatus: (props: {
    task: toDoItem;
    oldStatus: string;
    newStatus: string;
  }) => void;
  searchTerm: string | null;
  toDoColumnStatus: string;
  toDoColumnRef: RefObject<HTMLDivElement>;
  doingColumnRef: RefObject<HTMLDivElement>;
  doneColumnRef: RefObject<HTMLDivElement>;
};

type saveTaskProps = toDoItem & {
  toDoStatus: string;
};

export const ToDoColumn = (props: toDoColumnProps) => {
  const {
    tasks,
    addNewTask,
    cancelNewTask,
    saveTask,
    changeTaskStatus,
    searchTerm,
    toDoColumnStatus,
    toDoColumnRef,
    doingColumnRef,
    doneColumnRef,
  } = props;

  const getImageRef = () => {
    if (toDoColumnStatus === "To Do")
      return "../../../public/images/Home/ToDoIcon.svg";
    else if (toDoColumnStatus === "Doing")
      return "../../../public/images/Home/DoingIcon.svg";
    else return "../../../public/images/Home/DoneIcon.svg";
  };

  const getColumnRef = () => {
    if (toDoColumnStatus === "To Do") return toDoColumnRef;
    else if (toDoColumnStatus === "Doing") return doingColumnRef;
    else if (toDoColumnStatus === "Done") return doneColumnRef;
  };

  return (
    <Stack
      className="task-column"
      rowGap="20px"
      flex="1"
      width={{
        xs: "",
        sm: "190px",
        md: "260px",
        lg: "360px",
      }}
    >
      <Stack
        className="task-status"
        direction="row"
        alignItems="center"
        bgcolor="#FFFFFF"
        sx={{
          p: "15px",
          borderRadius: "10px",
          boxShadow: "0px 3px 6px #00000029",
          position: "sticky",
          top: "90px",
          zIndex: "200",
        }}
      >
        <img className="task-status-image" src={getImageRef()} alt="" />
        <Typography
          ml="15px"
          sx={{
            color: "#212529",
            font: "normal normal medium 16px/24px 'HelveticaNeue' , sans-serif",
            fontWeight: "bold",
          }}
        >
          {toDoColumnStatus}
        </Typography>
      </Stack>
      <Stack
        className="task-wrapper"
        minHeight="100vh"
        ref={getColumnRef()}
        rowGap="20px"
      >
        {addNewTask && (
          <ToDoItem
            toDoId={0}
            toDoTitle=""
            toDoCategory=""
            toDoEstimate=""
            toDoDueDate=""
            toDoImportance="Low"
            toDoStatus={toDoColumnStatus}
            saveTask={saveTask}
            searchTerm={searchTerm}
            cancelNewTask={cancelNewTask}
            toDoColumnRef={toDoColumnRef}
            doingColumnRef={doingColumnRef}
            doneColumnRef={doneColumnRef}
          />
        )}
        {tasks.map((t) => {
          return (
            <ToDoItem
              key={`to-do-item-${t.toDoId}`}
              toDoId={t.toDoId}
              toDoTitle={t.toDoTitle}
              toDoCategory={t.toDoCategory}
              toDoEstimate={t.toDoEstimate}
              toDoDueDate={t.toDoDueDate}
              toDoImportance={t.toDoImportance}
              toDoStatus={toDoColumnStatus}
              saveTask={saveTask}
              changeTaskStatus={changeTaskStatus}
              searchTerm={searchTerm}
              toDoColumnRef={toDoColumnRef}
              doingColumnRef={doingColumnRef}
              doneColumnRef={doneColumnRef}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};
