import {v1} from "uuid";
import {useState} from "react";
import {TodoListType} from "../App";
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC,
    TodolistReducer
} from "./todolist-reducer";


test('correct todolist should be removed',()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState:Array<TodoListType> = [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ]

    // const endState = TodolistReducer(startState,{type: 'REMOVE-TODOLIST',id:todolistID1})
    const endState = TodolistReducer(startState,removeTodolistAC(todolistID1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistID2);

})

test('new todolist should be added',()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState:Array<TodoListType> = [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ]

    const endState = TodolistReducer(startState,addTodolistAC('new Title'))

    expect(endState.length).toBe(3);
    expect(endState[0].id).toBe(todolistID1);
    expect(endState[2].title).toBe('new Title');
    expect(endState[1].id).toBe(todolistID2);

})

test('todolist title should be changed',()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState:Array<TodoListType> = [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ]
    const newTitle = 'Its a New Todolist Title'

    const endState = TodolistReducer(startState,changeTodoListTitleAC(todolistID1,newTitle))

    expect(endState[0].title).toBe('Its a New Todolist Title')
    expect(endState[1].title).toBe('What to buy')
})

test('todolist filter should be changed',()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState:Array<TodoListType> = [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ]
    const newFilter = 'active'

    const endState = TodolistReducer(startState,changeTodoListFilterAC(todolistID1,newFilter))

    expect(endState[0].filter).toBe('active')
    expect(endState[1].filter).toBe('all')
})