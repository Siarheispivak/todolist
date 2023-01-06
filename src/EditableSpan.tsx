import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    changeTitle:(newTitle:string)=>void
}

const EditableSpan = (props: EditableSpanPropsType) => {

    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)

    const setLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onEditMode = () => setIsEditMode(true)
    const offEditMode = () =>{
        setIsEditMode(false)
        props.changeTitle(title)
    }

    const onKeyDownOffEditMode = (e:KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && offEditMode()
    }

    return (
        isEditMode
            ? <TextField variant="standard" value={title}
                     onChange={setLocalTitle}
                     onBlur={offEditMode}
                     onKeyDown={onKeyDownOffEditMode}
                     autoFocus/>
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
};

export default EditableSpan;