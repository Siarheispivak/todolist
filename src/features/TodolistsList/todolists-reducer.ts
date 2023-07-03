import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    AppActionsType,
    RequestStatusType,
    setError,
    setLoadingStatus,
    SetLoadingStatusType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error.utils";
import {AxiosError} from "axios";
import {ErrorType} from "./tasks-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType ): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, entityStatus:'idle', filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, entityStatus:'idle', filter: 'all'}))
        case "CHANGE-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl,entityStatus:action.entityStatus} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (id: string,entityStatus:RequestStatusType) => ({type: 'CHANGE-ENTITY-STATUS', id,entityStatus} as const)

// thunks
export const fetchTodolistsTC  = () => {
    return (dispatch: Dispatch<TodolistActionsType>) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setLoadingStatus('succeeded'))
                dispatch(setTodolistsAC(res.data))
            })
            .catch((error)=>{
                dispatch(setLoadingStatus('failed'))
                dispatch(setTodolistsAC(error.message))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<TodolistActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then(() => {   ///res
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setLoadingStatus('succeeded'))
            })
            .catch(()=>{
                dispatch(changeTodolistEntityStatusAC(todolistId,'failed'))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<TodolistActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if(res.data.resultCode === ResultCode.SUCCESS){
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setLoadingStatus('succeeded'))
                }else{
                    handleServerAppError<{item:TodolistType}>(dispatch,res.data)
                }
            })
            .catch((err: AxiosError<ErrorType>) => { // сюда прокидываем тип данных который указан на бэке <ErrorType>
                const _err = err.response ? err.response.data.messages[0] : err.message
                handleServerNetworkError(dispatch, _err)
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<TodolistActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if(res.data.resultCode === ResultCode.SUCCESS){
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setLoadingStatus('succeeded'))
                }else{
                    if(res.data.messages.length){
                        dispatch(setError(res.data.messages[0]))
                    }else{
                        dispatch(setError('some error'))
                    }
                    dispatch(setLoadingStatus('failed'))
                }
            })
            .catch((err:AxiosError<ErrorType>)=>{
                const _err = err.response ? err.response.data.messages[0] : err.message
                handleServerNetworkError(dispatch,_err)
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;
type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | SetLoadingStatusType
    | AppActionsType
    | ChangeTodolistEntityStatusActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
