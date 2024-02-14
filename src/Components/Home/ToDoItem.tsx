// Mui imports
import { Stack, Box, Typography, MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// react imports

import { useEffect, useRef, RefObject, useState, ChangeEvent } from "react";
import { toDoItem } from "./HomePageContent";
import axios from "axios";
import Cookies from "js-cookie";

export type toDoItemProps = {
  toDoId: number;
  toDoTitle: string;
  toDoCategory: string;
  toDoDueDate: string;
  toDoEstimate: string;
  toDoImportance: string;
  toDoStatus: string;
  cancelNewTask?: () => void;
  saveTask: (item: saveTaskProps) => void;
  changeTaskStatus?: (props: {
    task: toDoItem;
    oldStatus: string;
    newStatus: string;
  }) => void;
  searchTerm: string | null;
  toDoColumnRef: RefObject<HTMLDivElement>;
  doingColumnRef: RefObject<HTMLDivElement>;
  doneColumnRef: RefObject<HTMLDivElement>;
};

type saveTaskProps = toDoItem & {
  toDoStatus: string;
};

export const ToDoItem = (props: toDoItemProps) => {
  const {
    toDoId,
    toDoTitle,
    toDoCategory,
    toDoDueDate,
    toDoEstimate,
    toDoImportance,
    toDoStatus,
    saveTask,
    changeTaskStatus,
    searchTerm,
    cancelNewTask,
    toDoColumnRef,
    doingColumnRef,
    doneColumnRef,
  } = props;

  const [isNewTask, setisNewTask] = useState<boolean>(false);
  const [isToDoItemEditable, setisToDoItemEditable] = useState<boolean>(false);

  const [title, settitle] = useState<string>("");
  const [category, setcategory] = useState<string>("");

  const [estimateTime, setestimateTime] = useState<string>("");
  const [importance, setimportance] = useState<string>("");

  const [displayedDate, setdisplayedDate] = useState<string>("");
  const [selectedDate, setselectedDate] = useState<Dayjs | null>();

  const [titleError, settitleError] = useState<boolean>(false);
  const [categoryError, setcategoryError] = useState<boolean>(false);
  const [dateError, setdateError] = useState<null | string>("");
  const [estimateError, setestimateError] = useState<boolean>(false);

  const toDoItemRef = useRef<HTMLDivElement>(null!);

  const handleClickToDoItem = () => {
    setisToDoItemEditable(true);
  };

  // The drag and drop process

  useEffect(() => {
    const changeStatusFromDatabase = (newStatus: string) => {
      const inputDate =
        selectedDate?.toISOString() !== undefined
          ? selectedDate?.toISOString()
          : new Date().toISOString();

      console.log(toDoImportance);

      const input = {
        toDoId: toDoId,
        toDoTitle: toDoTitle,
        toDoCategory: toDoCategory,
        toDoDueDate: inputDate,
        toDoEstimate: toDoEstimate,
        toDoImportance: toDoImportance,
        toDoStatus: newStatus,
      };

      const userId = Cookies.get("id");
      const token = Cookies.get("jwt");

      if (userId === undefined) return;

      console.log(input);

      const res = axios.put(
        "https://localhost:7140/api/Task/" + toDoId,
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
    };

    toDoItemRef.current.addEventListener("dragstart", function () {
      let selected: HTMLDivElement | null = toDoItemRef.current;

      doingColumnRef.current?.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      doingColumnRef.current?.addEventListener("drop", function () {
        const changeStatusFromDatabase = (newStatus: string) => {
          const inputDate =
            selectedDate?.toISOString() !== undefined
              ? selectedDate?.toISOString()
              : new Date().toISOString();

          console.log(toDoImportance);

          const input = {
            toDoId: toDoId,
            toDoTitle: toDoTitle,
            toDoCategory: toDoCategory,
            toDoDueDate: inputDate,
            toDoEstimate: toDoEstimate,
            toDoImportance: toDoImportance,
            toDoStatus: newStatus,
          };

          const userId = Cookies.get("id");

          if (userId === undefined) return;

          const token = Cookies.get("jwt");

          const res = axios.put(
            "https://localhost:7140/api/Task/" + toDoId,
            input,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(res);
        };
        changeStatusFromDatabase("Doing");
        if (selected !== null) doingColumnRef.current?.prepend(selected);
        selected = null;
      });

      toDoColumnRef.current?.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      toDoColumnRef.current?.addEventListener("drop", function () {
        changeStatusFromDatabase("To Do");
        if (selected !== null) toDoColumnRef.current?.prepend(selected);
        selected = null;
      });

      doneColumnRef.current?.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      doneColumnRef.current?.addEventListener("drop", function () {
        changeStatusFromDatabase("Done");
        if (selected !== null) doneColumnRef.current?.prepend(selected);
        selected = null;
      });
    });
  }, [
    selectedDate,
    doingColumnRef,
    toDoColumnRef,
    doneColumnRef,
    toDoId,
    toDoCategory,
    toDoDueDate,
    toDoEstimate,
    toDoImportance,
    toDoStatus,
    changeTaskStatus,
    toDoTitle,
  ]);

  useEffect(() => {
    settitle(toDoTitle);
    setcategory(toDoCategory);

    const date = dayjs(toDoDueDate);

    if (!date.isValid()) {
      const d = dayjs(new Date());
      setselectedDate(dayjs(new Date()));
      setdisplayedDate(`${d.date()}/${d.month() + 1}/${d.year()}`);
    } else {
      setdisplayedDate(`${date.date()}/${date.month() + 1}/${date.year()}`);
      setselectedDate(dayjs(toDoDueDate));
    }

    setestimateTime(toDoEstimate);
    setimportance(toDoImportance);
    if (toDoTitle === "" && toDoCategory === "" && toDoEstimate === "") {
      setisNewTask(true);
      setisToDoItemEditable(true);
    }
  }, [toDoTitle, toDoCategory, toDoDueDate, toDoEstimate, toDoImportance]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    settitle(e.currentTarget.value);
    if (e.currentTarget.value === "") settitleError(true);
    else settitleError(false);
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.currentTarget.value;
    if (inputString === "" || inputString === null) setcategoryError(true);
    else setcategoryError(false);
    setcategory(inputString);
  };

  const handleChangeImportance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setimportance(e.target.value as string);
  };

  const handleChangeDueDate = (date: Dayjs | null) => {
    setselectedDate(date);
  };

  const handleChangeEstimate = (e: ChangeEvent<HTMLInputElement>) => {
    const enteredString = e.currentTarget.value;

    const regex = /^[\d.]+(?: [a-zA-Z]+)?$/;

    const isMatch = regex.test(enteredString);

    if (!isMatch) setestimateError(true);
    else setestimateError(false);

    setestimateTime(enteredString);
  };

  const areCredentialsValid = () => {
    let validInfomration = true;

    if (title === "") {
      settitleError(true);
      validInfomration = false;
    }

    if (category === "") {
      validInfomration = false;
      setcategoryError(true);
    }

    if (
      selectedDate?.date() === undefined ||
      selectedDate?.month() === undefined ||
      selectedDate?.year() === undefined
    ) {
      validInfomration = false;
      setdateError("invalidDate");
    }

    if (estimateTime === "") {
      validInfomration = false;
      setestimateError(true);
    }

    if (!validInfomration) return false;

    if (titleError || estimateError || dateError) return false;

    return true;
  };

  const saveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const areInformationValid = areCredentialsValid();

    if (!areInformationValid) return;

    const inputDate =
      selectedDate?.toISOString() !== undefined
        ? selectedDate?.toISOString()
        : new Date().toISOString();

    const input = {
      toDoId: toDoId,
      toDoTitle: title,
      toDoCategory: category,
      toDoDueDate: inputDate,
      toDoEstimate: estimateTime,
      toDoImportance: importance,
      toDoStatus: toDoStatus,
    };

    const userId = Cookies.get("id");

    if (userId === undefined) return;

    try {
      if (toDoId === 0 || toDoId === undefined) {
        // It means that this item will be inserted in the database(e.g post method)

        const token = Cookies.get("jwt");

        const res = await axios.post(
          "https://localhost:7140/api/Task?userId=" + userId,
          input,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "success") {
          const newTask = res.data.data;

          const date = dayjs(newTask.toDoDueDate);

          if (date.isValid()) {
            newTask.toDoDueDate = `${date.date()}/${
              date.month() + 1
            }/${date.year()}`;
          } else {
            newTask.toDoDueDate = dayjs(new Date()).toISOString();
          }

          saveTask(newTask);

          setisNewTask(false);

          setisToDoItemEditable(false);
        }
      } else {
        // edit method becasue the item has an id which means it will be edited

        try {
          const token = Cookies.get("jwt");

          const res = await axios.put(
            "https://localhost:7140/api/Task/" + toDoId,
            input,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.status === "success") {
            saveTask(input);

            setisNewTask(false);

            setisToDoItemEditable(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    settitle(toDoTitle);
    setcategory(toDoCategory);

    const date = dayjs(toDoDueDate);

    if (!date.isValid()) {
      setselectedDate(dayjs(new Date()));
    } else {
      setselectedDate(dayjs(toDoDueDate));
    }

    setselectedDate(dayjs(toDoDueDate));

    setestimateTime(toDoEstimate);
    setimportance(toDoImportance);

    setisToDoItemEditable(false);
  };

  return (
    <Box
      className="to-do-item"
      ref={toDoItemRef}
      draggable={`${isToDoItemEditable ? "false" : "true"}`}
      bgcolor="#FFFFFF"
      textAlign={{
        xs: "center",
        md: "left",
      }}
      p={{
        xs: "5px",
        sm: "10px",
        md: "15px",
        lg: "20px",
      }}
      sx={{
        boxShadow: "0px 3px 6px #00000029",
        borderRadius: "6px",
      }}
      onClick={handleClickToDoItem}
    >
      {isToDoItemEditable ? (
        <textarea
          rows={3}
          placeholder="Add a title..."
          className={`add-title-input ${titleError && "error"}`}
          value={title}
          onChange={handleTextChange}
        />
      ) : (
        <Typography
          fontWeight="bold"
          fontSize={{
            xs: "14px",
            sm: "16px",
            md: "18px",
          }}
          mb="20px"
        >
          {searchTerm === null ? (
            <>{title}</>
          ) : (
            <>
              {title
                .split(new RegExp(`(${searchTerm})`, "gi"))
                .map((part, index) =>
                  part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <mark key={index}>{part}</mark>
                  ) : (
                    part
                  )
                )}
            </>
          )}
        </Typography>
      )}

      <Stack
        rowGap={{
          xs: "10px",
          sm: "12px",
          md: "20px",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          columnGap={{
            xs: "15px",
            md: "20px",
            lg: "30px",
          }}
          alignItems="center"
        >
          <Typography
            fontSize="13px"
            sx={{
              minWidth: {
                md: "70px",
              },
              color: "#6C757D",
            }}
          >
            Category
          </Typography>
          {isToDoItemEditable ? (
            <input
              className={`category-input ${categoryError && "error"}`}
              placeholder="Finance..."
              type="text"
              value={category}
              onChange={handleChangeCategory}
            />
          ) : (
            <Typography variant="subtitle2" sx={{ color: "#000000" }}>
              {category}
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          columnGap={{
            xs: "15px",
            md: "20px",
            lg: "30px",
          }}
          alignItems="center"
        >
          <Typography
            fontSize="13px"
            sx={{
              minWidth: {
                md: "70px",
              },
              color: "#6C757D",
            }}
          >
            Due Date
          </Typography>
          {isToDoItemEditable ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  transform: "translateY(2px)",
                  "& input": {
                    padding: "5.5px 14px",
                  },
                  "& fieldset": {
                    borderColor: `${dateError && "red"}`,
                  },
                }}
                // disablePast
                onError={(newError) => setdateError(newError)}
                slotProps={{
                  textField: {
                    helperText:
                      dateError === "disablePast"
                        ? "Past Dates are not allowed"
                        : dateError === "invalidDate"
                        ? "invalid date"
                        : "",
                  },
                }}
                value={selectedDate}
                onChange={handleChangeDueDate}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          ) : (
            <Typography variant="subtitle2" sx={{ color: "#000000" }}>
              {displayedDate}
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          columnGap={{
            xs: "15px",
            md: "20px",
            lg: "30px",
          }}
          alignItems="center"
        >
          <Typography
            fontSize="13px"
            sx={{
              minWidth: {
                md: "70px",
              },
              color: "#6C757D",
            }}
          >
            Estimate
          </Typography>
          {isToDoItemEditable ? (
            <>
              <input
                className={`estimate-input ${estimateError && "error"}`}
                type="text"
                placeholder="example: 6 hours"
                value={estimateTime}
                onChange={handleChangeEstimate}
              />
            </>
          ) : (
            <Typography variant="subtitle2" sx={{ color: "#000000" }}>
              {estimateTime}
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          columnGap={{
            xs: "15px",
            md: "20px",
            lg: "30px",
          }}
          alignItems="center"
          minHeight="32px"
        >
          <Typography
            fontSize="13px"
            sx={{
              minWidth: {
                md: "70px",
              },
              color: "#6C757D",
            }}
          >
            Importance
          </Typography>
          {isToDoItemEditable ? (
            <TextField
              size="small"
              select
              fullWidth
              value={importance}
              onChange={handleChangeImportance}
              sx={{
                "& div": {
                  fontSize: "13px",
                },
              }}
            >
              <MenuItem selected value="Low">
                Low
              </MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </TextField>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{
                padding: "5px 12px",
                color: "white",
                textAlign: "center",
                backgroundColor: `${
                  importance === "High"
                    ? "#DC3545"
                    : importance === "Medium"
                    ? "#FE913E"
                    : importance === "Low"
                    ? "#39AC95"
                    : "transparent"
                }`,
                borderRadius: "4px",
              }}
            >
              {importance}
            </Typography>
          )}
        </Stack>
        {isToDoItemEditable && (
          <Stack direction="row" columnGap="10px">
            {isNewTask ? (
              <button onClick={cancelNewTask} className="cancel-button">
                Cancel
              </button>
            ) : (
              <button onClick={cancelChanges} className="cancel-button">
                Cancel
              </button>
            )}

            <button onClick={saveChanges} className="save-button">
              Save
            </button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
