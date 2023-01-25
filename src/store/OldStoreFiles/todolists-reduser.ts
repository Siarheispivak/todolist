//1. Должна заменить прежний зоопарк
//2. Задача - только преобразования
//2. Вернуть новый стейт

import {v1} from "uuid";

export const REMOVE_TODOLIST = "REMOVE-TODOLIST" as const
export const ADD_TODOLIST = "ADD-TODOLIST" as const
export const CHANGE_TITLE = "CHANGE-TODOLIST-TITLE" as const
export const CHANGE_FILTER = "CHANGE-TODOLIST-FILTER" as const

import {FilterValuesType, TodoListType} from "../App";

export type RemoveTodoListAT = {
    type:typeof REMOVE_TODOLIST
    id:string
}
export type AddTodoListAT = {
    type:typeof ADD_TODOLIST
    title:string
    todolistId:string
}
type ChangeTodolistTitleAT = {
    type:typeof CHANGE_TITLE
    title:string
    id:string
}
type ChangeTodolistFilterAT = {
    type:typeof CHANGE_FILTER
    id:string
    filter:FilterValuesType
}
export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodolistTitleAT | ChangeTodolistFilterAT

export const todolistsReducer = (todolists: Array<TodoListType>,action:ActionType): Array<TodoListType> => {

    switch(action.type){
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            const newTodoList: TodoListType = {
                id:action.todolistId,
                title:action.title,
                filter:'all'
            }
            return [...todolists,newTodoList]
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case  "CHANGE-TODOLIST-FILTER":
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default :
            return todolists
    }
}

export const removeTodoListAC = (id:string):RemoveTodoListAT => {
    return {type:REMOVE_TODOLIST,id}
}
export const addTodoListAC = (title:string):AddTodoListAT => ({type:ADD_TODOLIST,title,todolistId:v1()})
export const ChangeTodolistTitleAC = (id:string,title:string):ChangeTodolistTitleAT => ({type:CHANGE_TITLE,title,id})
export const ChangeTodolistFilterAC = (id:string,filter:FilterValuesType):ChangeTodolistFilterAT => ({type:CHANGE_FILTER,filter,id})