import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
import {
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {RequestStatusType, setError, SetErrorType, setLoadingStatus, SetLoadingStatusType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error.utils";
import axios, {AxiosError} from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityTaskStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map(e => ({...e, entityTaskStatus: 'idle'}))}              ////////
        case "CHANGE-TASK-ENTITY-STATUS":
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    entityTaskStatus: action.entityTaskStatus
                } : t)
            }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const setTasksEntityStatusAC = (taskId: string, entityTaskStatus: RequestStatusType, todolistId: string) =>
    ({type: "CHANGE-TASK-ENTITY-STATUS", taskId, entityTaskStatus, todolistId} as const)                                          //

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
            dispatch(setLoadingStatus('succeeded'))
        })
        .catch((err: AxiosError<ErrorType>) => { // сюда прокидываем тип данных который указан на бэке <ErrorType>
            const _err = err.response ? err.response.data.messages[0] : err.message
            handleServerNetworkError(dispatch, _err)
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    dispatch(setTasksEntityStatusAC(taskId, 'loading', todolistId))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setLoadingStatus('succeeded'))
        })
        .catch((err: AxiosError<ErrorType>) => { // сюда прокидываем тип данных который указан на бэке <ErrorType>
            const _err = err.response ? err.response.data.messages[0] : err.message
            handleServerNetworkError(dispatch, _err)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
                dispatch(setLoadingStatus('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setError(res.data.messages[0]))
                } else {
                    dispatch(setError('some error'))
                }
                dispatch(setLoadingStatus('failed'))
            }
        })
        .catch((err: AxiosError<ErrorType>) => { // сюда прокидываем тип данных который указан на бэке <ErrorType>
            const _err = err.response ? err.response.data.messages[0] : err.message
            handleServerNetworkError(dispatch, _err)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    async (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        dispatch(setLoadingStatus('loading'))
        dispatch(setTasksEntityStatusAC(taskId, 'loading', todolistId))                ////////

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            // //@ts-ignore
            // const mappedArray = res.data.data.item.map(el => el)
            if (res.data.resultCode === ResultCode.SUCCESS) {

                dispatch(updateTaskAC(taskId, domainModel, todolistId))
                dispatch(setLoadingStatus('succeeded'))
                dispatch(setTasksEntityStatusAC(taskId, 'succeeded', todolistId))         ////////
            } else {
                handleServerAppError<{ item: TaskType }>(dispatch, res.data)
            }
        } catch (e) {
            let errorMessage: string
            if (axios.isAxiosError<ErrorType>(e)) {
                errorMessage = e.response!.data.messages[0]
            } else {
                debugger
                errorMessage = (e as Error).message
            }
            handleServerNetworkError(dispatch, errorMessage)
        }
    }

// types
export type ErrorType = {
    "statusCode": number,
    "messages": string[],
    "error": string
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType & { entityTaskStatus: RequestStatusType }>                           ////////
}
type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksEntityStatusAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | SetLoadingStatusType
    | SetErrorType
