//app-reducer.tsx


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error:null as null| string
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state,error: action.error}
        default:
            return state
    }
}

//actions
export const setError = (error:null|string) => ({type:'APP/SET-ERROR',error} as const)
export const setLoadingStatus = (status:RequestStatusType) => ({type:"APP/SET-STATUS",status} as const);

//thunks


//types
export type SetLoadingStatusType = ReturnType<typeof setLoadingStatus>
export type SetErrorType = ReturnType<typeof setError>

export type AppActionsType = SetLoadingStatusType | SetErrorType
