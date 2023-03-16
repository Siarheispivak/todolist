import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "./Todolist";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";


type TaskPropsType = {
    todolistId: string
    task: TaskType
}
export const TaskWithRedux = memo(({
                         todolistId,
                         task
                     }:TaskPropsType) => {
    const dispatch = useDispatch();

    const removeTaskHandler = useCallback(()=> {
        dispatch(removeTaskAC(task.id, todolistId));
    },[dispatch,todolistId,task.id]);

    const changeTaskStatusHandler = useCallback((e:ChangeEvent<HTMLInputElement>) =>{
        dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, todolistId));
    },[dispatch]);

    const changeTaskTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTaskTitleAC(task.id, newTitle, todolistId));
    },[dispatch]);

    return (
        <div className={task.isDone ? "is-done" : ""}>
            <Checkbox
                checked={task.isDone}
                color="primary"
                onChange={changeTaskStatusHandler}
            />
            <EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
            {/*//оберуть в компоненту для оптимизации перерисовки*/}
            <IconButton onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    );
});
