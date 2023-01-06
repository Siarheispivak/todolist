import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';

type AddItemFormPropsType = {
    addItem:(title:string)=>void

}

const AddItemForm = (props:AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const setLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }
    const errorStyles = {fontWeight: "bold", color: "red"}
    // const errorMessage = error
    //     ? <div style={errorStyles}>Please, enter new title</div>
    //     : null

    const onEnterAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItem()
        }
    }
    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle("")
    }

    return (
        <div>
            <TextField
                sx={{padding:"0px"}}
                value={title}
                onKeyDown={onEnterAddItem}
                onChange={setLocalTitle}
                className={error ? "input-error" : ""}
                label="title"
                error={error}
                helperText={error && 'Please, enter new title'}
            />

            <Button
                sx={{fontSize:"10px",p: "4px 4px", }}
                size="small"
                variant="contained"
                onClick={addItem}
                endIcon={<PostAddOutlinedIcon/>}
            >Add</Button>
            {/*{errorMessage}*/}
        </div>
    );
};

export default AddItemForm;