//1. Должна заменить прежний зоопарк
//2. Задача - только преобразования
//2. Вернуть новый стейт

import {v1} from "uuid";

export const REMOVE_TASK = "REMOVE-TASK" as const
export const ADD_TASK = "ADD-TASK" as const
export const CHANGE_STATUS = "CHANGE-TASK-STATUS" as const
export const CHANGE_TITLE = "CHANGE-TASK-TITLE" as const

import {TasksStateType} from "../App";
import {ADD_TODOLIST, AddTodoListAT, REMOVE_TODOLIST, RemoveTodoListAT} from "./todolists-reduser";

type RemoveTaskAT = {
    type: typeof REMOVE_TASK
    todolistId: string
    taskId: string
}
type AddTaskAT = {
    type: typeof ADD_TASK
    todolistId: string
    title: string
}
type ChangeTaskStatusAT = {
    type: typeof CHANGE_STATUS
    todolistId: string
    taskId: string
    isDone: boolean
}
type ChangeTaskTitleAT = {
    type: typeof CHANGE_TITLE
    todolistId: string
    taskId: string
    title: string
}


export type ActionsType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodoListAT | RemoveTodoListAT

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state};
            const tasks = state[action.todolistId];
            const filteredTasks = tasks.filter(task => task.id !== action.taskId)
            stateCopy[action.todolistId] = filteredTasks
            return stateCopy
        }
        case "ADD-TASK": {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            const newTask = {id: v1(), title: action.title, isDone: false};
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks;
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId]
            //найдём нужную таску
            let task = tasks.find(t => t.id === action.taskId)
            //изменим нужную таску
            if (task) {
                task.isDone = action.isDone;
            }
            return stateCopy;
        }
        case CHANGE_TITLE: {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId]
            //найдём нужную таску
            let task = tasks.find(t => t.id === action.taskId)
            //изменим нужную таску
            if (task) {
                task.title = action.title;
            }
            return stateCopy;
        }
        case ADD_TODOLIST:{
            const stateCopy = {...state};
            stateCopy[action.todolistId] = []
            return stateCopy
        }
        case REMOVE_TODOLIST:{
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            throw new Error('I dont understand this action type')
    }
}


export const RemoveTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => {
    return {type: REMOVE_TASK, todolistId, taskId}
}
export const AddTaskAC = (title: string, todolistId: string): AddTaskAT => {
    return {type: ADD_TASK, title: title, todolistId}
}
export const ChangeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusAT => {
    return {type: CHANGE_STATUS,isDone, todolistId, taskId}
}
export const ChangeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleAT => {
    return {type: CHANGE_TITLE,title, todolistId, taskId}
}


