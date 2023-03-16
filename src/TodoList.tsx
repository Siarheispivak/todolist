import React, {memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {ButtonContainer} from "./ButtonContainer";
import {TaskWithRedux} from "./TaskWithRedux";
import {TaskWithRedux2} from "./TaskWithRedux2";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    // removeTask: (taskId: string, todolistId: string) => void
    // changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    filter: FilterValuesType
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist = memo((props: PropsType) => {

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.id]);

    let tasks = props.tasks;
    if (props.filter === "active") {
        tasks = tasks.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.isDone === true);
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(task => {
                    return <TaskWithRedux
                        key={task.id}
                        todolistId={props.id}
                        task={task}
                    />
                })
            }


            {/*{*/}
            {/*    tasks.map(task => {*/}
            {/*        return <TaskWithRedux2*/}
            {/*            key={task.id}*/}
            {/*            task={task}*/}
            {/*            todolistId={props.id}*/}
            {/*        />*/}
            {/*    })*/}
            {/*}*/}
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonContainer title={'ALL'} variant={props.filter === 'all' ? 'outlined' : 'text'} color={'inherit'}
                             callback={onAllClickHandler}/>
            <ButtonContainer title={'ACTIVE'} variant={props.filter === 'active' ? 'outlined' : 'text'}
                             color={'primary'} callback={onActiveClickHandler}/>
            <ButtonContainer title={'COMPLETED'} variant={props.filter === 'completed' ? 'outlined' : 'text'}
                             color={'secondary'} callback={onCompletedClickHandler}/>
        </div>
    </div>
})




















