
type InitialStateType = typeof initialState
const initialState = {
    status: 'loading' as RequestStatusType,
    error:null as null| string,
    isInitialized:false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state,error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state,isInitialized:action.isInitialized}
        default:
            return state
    }
}

//actions
export const setError = (error:null|string) => ({type:'APP/SET-ERROR',error} as const)
export const setLoadingStatus = (status:RequestStatusType) => ({type:"APP/SET-STATUS",status} as const);
export const setInitializedAC = (isInitialized:boolean) => ({type:'APP/SET-INITIALIZED',isInitialized} as const);

//thunks


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'




export type SetLoadingStatusType = ReturnType<typeof setLoadingStatus>
export type SetErrorType = ReturnType<typeof setError>
export type setInitializedActionType = ReturnType<typeof setInitializedAC>

export type AppActionsType = SetLoadingStatusType | SetErrorType | setInitializedActionType
