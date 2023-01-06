import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, tasksReducer} from "./tasks-reduser";
import {addTodoListAC, removeTodoListAC} from "./todolists-reduser";


test('correct task should be removed', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }

    //2.
    const endState = tasksReducer(startState, RemoveTaskAC('2', todolistId2))// можно так
    //3.
    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(2);
    expect(endState[todolistId2].every(t => t.id != '2')).toBeTruthy();
});
test('task should be added', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }

    //2.
    const endState = tasksReducer(startState, AddTaskAC('juice', todolistId2))// можно так
    //3.
    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(4);
    expect(endState[todolistId2][0].id).toBeDefined();
    expect(endState[todolistId2][0].title).toBe('juice');
    expect(endState[todolistId2][0].isDone).toBe(false);


});
test('isDone should be changed', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }

    //2.
    const endState = tasksReducer(startState, ChangeTaskStatusAC('2', false, todolistId2))// hz
    //3.

    expect(endState[todolistId2][1].isDone).toBeFalsy();
    expect(endState[todolistId1][1].isDone).toBeTruthy();
});
test('title should be changed', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }

    //2.
    const endState = tasksReducer(startState, ChangeTaskTitleAC('2', 'milky way', todolistId2))// hz
    //3.

    expect(endState[todolistId2][1].title).toBe('milky way');
    expect(endState[todolistId1][1].title).toBe("JS");
});

test('new property with new array should be added when new todolist is added', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }
    //2.
    const endState = tasksReducer(startState, addTodoListAC('title no matter'))
    //3.
    const keys = Object.keys(endState);
    const newKey = keys.find(el => el != todolistId1 && el != todolistId2);
    if(!newKey){
        throw Error("error")
    }
    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
});
test('remove todolist and tasks accordingly', () => {
    //1.
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TasksStateType = {
        [todolistId1]: [    // "id_1"
            {id: v1(), title: "HTML & CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: '2', title: "Meat", isDone: true},
            {id: v1(), title: "Wheat", isDone: false},
        ],
    }
    //2.
    const endState = tasksReducer(startState, removeTodoListAC(todolistId2))
    //3.
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState[todolistId2]).not.toBeDefined()
});