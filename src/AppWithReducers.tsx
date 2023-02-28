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

function AppWithReducers() {
    //BLL:
    let id_1 = v1();
    let id_2 = v1();

    let [todoLists, dispatchToTodolistsReducer] = useReducer(TodolistReducer, [
        {id: id_1, title: "What to learn", filter: "all"},
        {id: id_2, title: "What to buy", filter: "all"}
    ])

    let [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
        [id_1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [id_2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],

    })



    // Фенкции "ниже" не используются, ВСЁ ПОТОМУ ЧТО МЫ ТАСКИ ПЕРЕНЕСЛИ В TODOLIST.TSX
    // ПОТОМУ ЧТО ДЕЛАЛИ AppWithRedux,там надо было так сделать...
    // А из-за того что здесь нету useSelector и useDispatch, то мы их не переносили в этом App)

    const removeTask = (taskId: string, todoListId: string) => {
        const action = removeTaskAC(todoListId, taskId);
        dispatchToTasksReducer(action)
    }
    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(todoListId, title)
        dispatchToTasksReducer(action)
    }
    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(todoListId, taskId, isDone)
        dispatchToTasksReducer(action)
    }
    const changeTaskTitle = (taskId: string, newTitle: string, todoListId: string) => {
        const action = ChangeTaskTitleAC(todoListId, taskId, newTitle)
        dispatchToTasksReducer(action)
    }

    const removeTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId)
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }
    const addTodoList = (title: string) => {

        const action = addTodolistAC(title)
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        const action = changeTodoListTitleAC(todoListId, title)
        dispatchToTodolistsReducer(action)
    }
    const changeTodoListFilter = (nextFilterValue: FilterValuesType, todoListId: string) => {
        dispatchToTodolistsReducer(changeTodoListFilterAC(todoListId, nextFilterValue))
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

    const todoListsComponents = todoLists.map((tl: TodoListType) => {
        const filteredTasks = getFilteredTasks(tasks[tl.id], tl.filter)
        return (
            <Grid item>
                <Paper sx={{p: "20px"}} elevation={16}>
                    <TodoList
                        key={tl.id}
                        todoListId={tl.id}
                        // tasks={filteredTasks}
                        title={tl.title}
                        filter={tl.filter}

                        // addTask={addTask}
                        // removeTask={removeTask}
                        // changeTaskStatus={changeTaskStatus}
                        // changeTaskTitle={changeTaskTitle}

                        // ЗАКАМЕНЧЕННО ВСЁ ПОТОМУ ЧТО МЫ ТАСКИ ПЕРЕНЕСЛИ В TODOLIST.TSX
                        // ПОТОМУ ЧТО ДЕЛАЛИ AppWithRedux,там надо было так сделать...
                        // А из-за того что здесь нету useSelector и useDispatch, то мы их не переносили)

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

export default AppWithReducers;
