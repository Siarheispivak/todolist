import {addTaskAC, changeTaskStatusAC, ChangeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {v1} from "uuid";
import {TasksStateType} from "../App";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";

test('new task should be added', () => {

    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TasksStateType = {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    }
    const newTitle = 'A newTask Title'

    const endState = tasksReducer(startState, addTaskAC(todolistID1, newTitle))

    expect(endState.newTask).toBeDefined()
    // expect(endState.newTask.title).toBe(newTitle)
})
test('should remove correct task', () => {

    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TasksStateType = {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    }
    const endState = tasksReducer(startState, removeTaskAC(todolistID1, '2'))
    expect(endState).toBe(2)
})
test('change specified task status', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TasksStateType = {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: true},
            {id: v1(), title: 'materialUI', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, changeTaskStatusAC(todolistID1, '2', false))


    expect(endState[todolistID1][1].isDone).toBe(false)
    expect(endState[todolistID2][1].isDone).toBe(true)
})
test('change specified task title', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TasksStateType = {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: true},
            {id: v1(), title: 'materialUI', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, ChangeTaskTitleAC(todolistID1, '2', 'newTitle'))

    expect(endState[todolistID1][1].title).toBe('newTitle')
    expect(endState[todolistID2][1].title).toBe('GraphQL')
})




test('correct task should be added to correct array', () => {

    let todolistID1 = v1()
    let todolistID2 = v1()
    const startState: TasksStateType = {
        [todolistID1]: [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        [todolistID2]: [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = addTaskAC(todolistID2, 'juice')

    const endState = tasksReducer(startState, action)

    expect(endState[todolistID1].length).toBe(3)
    expect(endState[todolistID2].length).toBe(4)
    expect(endState[todolistID2][0].id).toBeDefined()
    expect(endState[todolistID2][0].title).toBe('juice')
    expect(endState[todolistID2][0].isDone).toBe(false)
})

test('correct task should be deleted from correct array', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = removeTaskAC('todolistId2', '2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'].length).toBe(2)
    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '3', title: 'tea', isDone: false}
        ]
    })
})

test('status of specified task should be changed', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()
    const startState: TasksStateType = {
        [todolistID1]: [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        [todolistID2]: [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = changeTaskStatusAC(todolistID2, '2', false)

    const endState = tasksReducer(startState, action)

    expect(endState[todolistID2][1].isDone).toBe(false)
    expect(endState[todolistID1][1].isDone).toBe(true)
})

test('title of specified task should be changed', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TasksStateType = {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: true},
            {id: v1(), title: 'materialUI', isDone: false},
        ]
    }

    const endState = tasksReducer(startState, ChangeTaskTitleAC(todolistID1, '2', 'newTitle'))

    expect(endState[todolistID1][1].title).toBe('newTitle')
    expect(endState[todolistID2][1].title).toBe('GraphQL')
})

test('new array should be added when new todolist is added', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = addTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

