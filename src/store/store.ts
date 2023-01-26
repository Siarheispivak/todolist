import {combineReducers, createStore} from "redux";
import {TodolistReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";


const rootReducer = combineReducers({
    todolists:TodolistReducer,
    tasks:tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);



// @ts-ignore
window.store = store;

