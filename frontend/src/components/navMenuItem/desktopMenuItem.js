import React, { Component } from 'react'
// import ListAlt from '@material-ui/icons/ListAlt';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";


const DesktopMenuItem = (props) => {
    const {clickFunc, name, Comp, compName} = props
    return (
        

        <IconButton onClick={clickFunc} name={compName} color="inherit">
            <Badge color="secondary">
                {Comp}
                
                {name}
            </Badge>
        </IconButton>

        
    )
}

export default DesktopMenuItem

