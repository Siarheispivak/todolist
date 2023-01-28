import {combineReducers, legacy_createStore} from "redux";
import {TodolistReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";


const rootReducer = combineReducers({
    todolists:TodolistReducer,
    tasks:tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer);



// @ts-ignore
window.store = store;

