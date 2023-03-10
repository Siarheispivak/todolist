import React from 'react';
import './App.css';
import TodoList from "./TodoList";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {addTodolistAC, changeTodoListFilterAC, changeTodoListTitleAC, removeTodolistAC} from "./store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";
import {Menu} from "@mui/icons-material";


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

    const addTodoList = (title: string) => {
        dispatch(addTodolistAC(title))
    }

    const todoListsComponents = todolists.map((tl: TodoListType) => {

        return (
            <Grid item  key={tl.id}>
                <Paper sx={{p: "20px"}} elevation={16}>
                    <TodoList
                        todoListId={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            {/*<Box sx={{ flexGrow: 1 }}>*/}
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            TodoLists
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            {/*</Box>*/}
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
