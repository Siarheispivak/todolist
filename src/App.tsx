import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Box, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";


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
    [todoListId: string]: Array<TaskType>
}

export type FilterValuesType = "all" | "active" | "completed"

function App() {
    //BLL:
    const id_1 = v1()
    const id_2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: id_1, title: "What to learn", filter: "all"},
        {id: id_2, title: "What to buy", filter: "all"}
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [id_1] : [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [id_2]: [
            {id: v1(), title: "Milk", isDone: true},
            // {id: v1(), title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],

    })

    const removeTask = (taskId: string, todoListId: string) => {
        setTasks({...tasks,
            [todoListId]: tasks[todoListId].filter(task => task.id !== taskId)
        })

    }
    const addTask = (title: string, todoListId: string) => {
        const newTask: TaskType = {id: v1(), title: title, isDone: false}

        setTasks({...tasks,
            [todoListId]: [newTask, ...tasks[todoListId]]
        })
    }
    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        setTasks({...tasks, [todoListId]: tasks[todoListId].map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        })
    }
    const changeTaskTitle = (taskId: string, newTitle: string, todoListId: string) => {
        setTasks({...tasks,
            [todoListId]: tasks[todoListId].map(t => t.id === taskId ? {...t, title:newTitle} : t)
        })
    }

    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListId))
        const copyTasks = {...tasks}
        delete  copyTasks[todoListId]
        setTasks(copyTasks)
    }
    const addTodoList = (title: string) => {
        const newTodoList: TodoListType = {
            id:v1(),
            title:title,
            filter:'all'
        }
        setTodoLists([...todoLists,newTodoList])
        setTasks({...tasks,[newTodoList.id]:[]})
    }
    const changeTodoListTitle = (title:string,todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
    }
    const changeTodoListFilter = (nextFilterValue: FilterValuesType, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, filter: nextFilterValue} : tl))
    }

    const getFilteredTasks =
        (tasks: Array<TaskType>, filter: FilterValuesType): Array<TaskType> => {
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
                <Grid container sx={{p:'10px 0px' }} >
                <AddItemForm addItem={addTodoList}/>

                </Grid>
                <Grid container spacing={4}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
