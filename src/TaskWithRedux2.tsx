import React, {ChangeEvent, memo, useCallback} from 'react';
import {TaskType} from "./Todolist";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";


type TaskWithRedux2PropsType = {
    task: TaskType
    todolistId: string
}


export const TaskWithRedux2 = memo(({
                                        task,
                                        todolistId
                                    }: TaskWithRedux2PropsType) => {

    const dispatch = useDispatch();

    const removeTaskHandler = useCallback(()=>{
        dispatch(removeTaskAC(task.id,todolistId))
    },[]);

    const changeTaskTitleHandler = useCallback((newTitle:string)=>{
        dispatch(changeTaskTitleAC(task.id,newTitle,todolistId))
    },[]);

    const changeTaskStatusHandler = useCallback((e:ChangeEvent<HTMLInputElement>)=>{
        dispatch(changeTaskStatusAC(task.id,e.currentTarget.checked,todolistId))
    },[])


    return (
        <div className={task.isDone ? "is-done" : ""}>
            <Checkbox
                checked={task.isDone}
                color="primary"
                onChange={changeTaskStatusHandler}
            />

            <EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
            <IconButton onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    );
});

