import React, {useReducer} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC,
    TodolistReducer
} from "./store/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, ChangeTaskTitleAC, removeTaskAC, tasksReducer} from "./store/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";


//C - create (validation)
//R - read (pagination, sorting, filtration)
//U - update (validation)
//D - delete (validation)

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
    // tasks: Array<TaskType>
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type FilterValuesType = "all" | "active" | "completed"

function AppWithRedux() {

    const dispatch = useDispatch();
    const todolists = useSelector<AppRootState, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType> (state => state.tasks)



    const removeTask = (taskId: string, todoListId: string) => {
        const action = removeTaskAC(todoListId, taskId);
        dispatch(action)
    }
    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(todoListId, title)
        dispatch(action)
    }
    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(todoListId, taskId, isDone))
    }
    const changeTaskTitle = (taskId: string, newTitle: string, todoListId: string) => {
        const action = ChangeTaskTitleAC(todoListId, taskId, newTitle)
        dispatch(action)
    }

    const removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId)
        dispatch(action)
    }
    const addTodoList = (title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        const action = changeTodoListTitleAC(todoListId, title)
        dispatch(action)
    }
    const changeTodoListFilter = (nextFilterValue: FilterValuesType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(todoListId, nextFilterValue))
    }

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

    const todoListsComponents = todolists.map((tl: TodoListType) => {
        const filteredTasks = getFilteredTasks(tasks[tl.id], tl.filter)
        return (
            <Grid item>
                <Paper sx={{p: "20px"}} elevation={16}>
                    <TodoList
                        key={tl.id}
                        todoListId={tl.id}
                        tasks={filteredTasks}
                        title={tl.title}
                        filter={tl.filter}

                        addTask={addTask}
                        removeTask={removeTask}
                        changeTaskStatus={changeTaskStatus}
                        changeTaskTitle={changeTaskTitle}

                        changeTodoListTitle={changeTodoListTitle}
                        removeTodoList={removeTodoList}
                        changeTodoListFilter={changeTodoListFilter}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            {/*/!*<Box sx={{ flexGrow: 1 }}>*!/*/}
            {/*    <AppBar position="static">*/}
            {/*        <Toolbar>*/}
            {/*            <IconButton*/}
            {/*                size="large"*/}
            {/*                edge="start"*/}
            {/*                color="inherit"*/}
            {/*                aria-label="menu"*/}
            {/*                sx={{ mr: 2 }}*/}
            {/*            >*/}
            {/*                <Menu />*/}
            {/*            </IconButton>*/}
            {/*            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>*/}
            {/*                TodoLists*/}
            {/*            </Typography>*/}
            {/*            <Button color="inherit">Login</Button>*/}
            {/*        </Toolbar>*/}
            {/*    </AppBar>*/}
            {/*/!*</Box>*!/*/}
            <Container fixed>
                <Grid container sx={{p: '10px 0px'}}>
                    <AddItemForm addItem={addTodoList}/>

                </Grid>
                <Grid container spacing={4}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
