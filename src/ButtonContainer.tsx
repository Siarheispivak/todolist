import React, {memo} from 'react';
import {Button} from "@mui/material";

type ButtonContainerType = {
    variant: "text" | "outlined" | "contained"
    callback: () => void
    color: "inherit" | "primary" | "secondary"
    title:string
}

export const ButtonContainer = memo((props: ButtonContainerType) => {
    console.log('ButtonContainer')
    return (
        <Button variant={props.variant}
                onClick={props.callback}
                color={props.color}
        >
            {props.title}
        </Button>
    );
});



