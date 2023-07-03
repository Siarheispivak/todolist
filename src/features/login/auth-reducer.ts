import {Dispatch} from 'redux'
import {
    SetErrorType,
    setInitializedAC,
    setInitializedActionType,
    setLoadingStatus,
    SetLoadingStatusType
} from '../../app/app-reducer'
import {authAPI, ResultCode} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error.utils";
import {LoginType} from "./Login";

const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

//thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    try {
        const result = await authAPI.login(data);
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setLoadingStatus('succeeded'))
        } else {
            handleServerAppError(dispatch, result.data)
        }
    } catch (e) {
        const error = (e as string)
        handleServerNetworkError(dispatch, error)
    }
}
export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    try {
        const result = await authAPI.me();
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setLoadingStatus('succeeded'))
            dispatch(setInitializedAC(true))
        } else {
            handleServerAppError(dispatch, result.data)
        }
    } catch (e) {
        const error = (e as string)
        handleServerNetworkError(dispatch, error)
    }finally {
        dispatch(setInitializedAC(true))
    }
}

export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setLoadingStatus('loading'))
    try {
        const result = await authAPI.logOut();
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setLoadingStatus('succeeded'))
            dispatch(setInitializedAC(false))
        } else {
            handleServerAppError(dispatch, result.data)
        }
    } catch (e)  {
        const error = (e as string)
        handleServerNetworkError(dispatch, error)
    }finally {
        dispatch(setInitializedAC(true))
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetLoadingStatusType | SetErrorType | setInitializedActionType