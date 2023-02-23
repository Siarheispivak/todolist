import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";



export type ActionsType =
    removeTodolistACType
    | addTodolistACType
    | changeTodoListTitleACType
    | changeTodoListFilterACType

// export const todo1=v1()
// export const todo2=v1()
const initialState:Array<TodoListType> = []

export const TodolistReducer = (state: Array<TodoListType> = initialState , action: ActionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodoListType = {
                id: action.payload.todolistID,
                title: action.payload.todolistTitle,
                filter: 'all'
            }
            return [...state, newTodolist]
        }
        case 'CHANGE-TODOLIST-TITLE': {

            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        }
        case 'CHANGE-FILTER': {
            return state.map(t => t.id === action.payload.id ? {...t,filter:action.payload.filter}:t)
        }
        default:
            return state
    }
}

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistID
        }
    } as const
}

export type addTodolistACType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (todolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolistID: v1(),
            todolistTitle: todolistTitle
        }
    } as const
}

type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export const changeTodoListTitleAC = (todolistID: string, newTitle: string) => {

    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id: todolistID,
            title: newTitle
        }
    } as const
}

type changeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>
export const changeTodoListFilterAC = (todolistID: string, newFilter: FilterValuesType) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            id: todolistID,
            filter: newFilter
        }
    } as const
}