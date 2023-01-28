import React, {ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from "./AppWithRedux";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem, Typography} from "@mui/material";
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";
import {addTaskAC, changeTaskStatusAC, ChangeTaskTitleAC, removeTaskAC} from "./store/tasks-reducer";

type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType

    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    changeTodoListFilter: (nextFilterValue: FilterValuesType, todoListId: string) => void
}

const TodoList = (props: TodoListPropsType) => {

    const dispatch = useDispatch();
    const tasks = useSelector<AppRootState, Array<TaskType>> (state => state.tasks[props.todoListId])

    const getFilteredTasks = (tasks: Array<TaskType>, filter: FilterValuesType): Array<TaskType> => {
        switch (filter) {
            case "completed":
                return tasks.filter(task => task.isDone)
            case "active":
                return tasks.filter(task => !task.isDone)
            default:
                return tasks
        }
    }
    const filteredTasks = getFilteredTasks(tasks, props.filter)
    // let allTodolistTasks = tasks
    // let tasksForTodolist = allTodolistTasks
    //
    // if (props.filter === "completed") {
    //     tasksForTodolist = allTodolistTasks.filter(task => task.isDone)
    // }
    // if (props.filter === "active") {
    //     tasksForTodolist = allTodolistTasks.filter(task => !task.isDone)
    // }


    const tasksListItems = tasks.length
        ? <List>{
            filteredTasks.map((task) => {
                const removeTask = () => {
                    const action = removeTaskAC(props.todoListId, task.id);
                    dispatch(action)
                }
                const changeTaskStatus = (e:ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(props.todoListId, task.id, e.currentTarget.checked))



                const changeTaskTitle = (title: string) => {
                    const action = ChangeTaskTitleAC(props.todoListId, task.id, title)
                    dispatch(action)
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
        const action = addTaskAC(props.todoListId, title)
        dispatch(action)
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