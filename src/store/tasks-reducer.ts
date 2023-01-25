import {TasksStateType, TaskType} from "../App";
import {addTodolistACType, removeTodolistACType} from "./todolist-reducer";

type TaskActionsType = addTaskACType
    | removeTaskACType
    | ChangeTaskStatusACType
    | ChangeTaskTitleACType
    | addTodolistACType
    | removeTodolistACType

export const tasksReducer = (state: TasksStateType, action: TaskActionsType) => {

    switch (action.type) {
        case 'ADD-TASK': {
            const newTask: TaskType = {
                id: action.payload.id,
                title: action.payload.title,
                isDone: false
            }
            return {...state, [action.payload.id]: [newTask, ...state[action.payload.id]]}
        }
        case "REMOVE-TASK": {
            return {
                ...state, [action.payload.todolistID]:
                    state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID)
            }
        }
        case 'CHANGE-STATUS': {
            return {
                ...state, [action.payload.todolistID]:
                    state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {
                        ...el,
                        isDone: action.payload.status
                    } : el)
            }
        }
        case 'CHANGE-TITLE': {
            return {
                ...state, [action.payload.todolistID]:
                    state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {
                        ...el,
                        title: action.payload.newTitle
                    } : el)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state, [action.payload.todolistID]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            // let copyState = {...state}
            // delete copyState[action.payload.id]
            // return copyState
            const {[action.payload.id]:[],...rest}= {...state}
            return rest
        }
        default:
            return state
    }

}
type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistID: string, newTitle: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            id: todolistID,
            title: newTitle
        }
    } as const
}

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistID: todolistID,
            taskID: taskID
        }
    } as const
}

type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistID: string, taskID: string, status: boolean) => {
    return {
        type: 'CHANGE-STATUS',
        payload: {
            todolistID: todolistID,
            taskID: taskID,
            status: status
        }
    } as const
}

type ChangeTaskTitleACType = ReturnType<typeof ChangeTaskTitleAC>
export const ChangeTaskTitleAC = (todolistID: string, taskID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TITLE',
        payload: {
            todolistID: todolistID,
            taskID: taskID,
            newTitle: newTitle
        }
    } as const
}