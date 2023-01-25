import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType, TaskType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem, Typography} from "@mui/material";
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType

    addTask: (title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todoListId: string) => void

    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    changeTodoListFilter: (nextFilterValue: FilterValuesType, todoListId: string) => void
}

const TodoList = (props: TodoListPropsType) => {

    const tasksListItems = props.tasks.length
        ? <List>{
            props.tasks.map((task) => {
                const removeTask = () => props.removeTask(task.id, props.todoListId)
                const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                    props.changeTaskStatus(task.id, e.currentTarget.checked, props.todoListId)
                const changeTaskTitle = (title: string) => {
                    props.changeTaskTitle(task.id, title, props.todoListId)
                }
                return (
                    <ListItem key={task.id} sx={{p: "0px"}}>
                        <Checkbox
                            size="small"
                            checked={task.isDone}
                            onChange={changeTaskStatus}
                        />
                        <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                        <IconButton onClick={removeTask} size="small">
                            <CancelPresentationOutlinedIcon fontSize="small" color="secondary"/>
                        </IconButton>
                    </ListItem>
                )
            })}</List>
        : <span>List is empty</span>

    const addNewTask = (title: string) => {
        props.addTask(title, props.todoListId)
    }
    const onClickHandlerCreator = (filter: FilterValuesType) =>
        () => props.changeTodoListFilter(filter, props.todoListId)
    const removeTodoList = () => props.removeTodoList(props.todoListId)

    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodoListTitle(newTitle, props.todoListId)
    }
    return (
        <div>
            <Typography variant={"h6"} align={'center'}>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <CancelPresentationOutlinedIcon/>
                </IconButton>
            </Typography>
            <AddItemForm addItem={addNewTask}/>
            {tasksListItems}
            <div>
                <ButtonGroup
                    fullWidth
                    disableElevation
                    size="small"
                    variant="contained"
                >
                    <Button
                        sx={{mr: '3px', fontSize: "10px", p: "4px 4px"}}
                        color={props.filter === "all" ? "secondary" : "primary"}
                        onClick={onClickHandlerCreator("all")}>All
                    </Button>
                    <Button

                        sx={{mr: '3px', fontSize: "10px", p: "4px 4px"}}
                        color={props.filter === "active" ? "secondary" : "primary"}
                        onClick={onClickHandlerCreator("active")}>Active
                    </Button>
                    <Button
                        sx={{fontSize: "10px", p: "4px 4px"}}
                        color={props.filter === "completed" ? "secondary" : "primary"}
                        onClick={onClickHandlerCreator("completed")}>Completed
                    </Button>
                </ButtonGroup>

            </div>
        </div>
    );
};


export default TodoList;