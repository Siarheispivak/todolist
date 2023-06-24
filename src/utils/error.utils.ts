import {SetErrorType, setError, setLoadingStatus, SetLoadingStatusType} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from '../api/todolists-api'

export const handleServerAppError = <T>( dispatch: Dispatch<ErrorUtilsDispatchType>,data:ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    } else {
        dispatch(setError('some error'))
    }
    dispatch(setLoadingStatus('failed'))
}


export const handleServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: string ) => {
    dispatch(setError(error))
    dispatch(setLoadingStatus('failed'))
}

export type ErrorUtilsDispatchType = SetErrorType | SetLoadingStatusType