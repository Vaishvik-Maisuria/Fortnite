import React, { Component } from 'react'
// import ListAlt from '@material-ui/icons/ListAlt';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";


const NavMenuItem = (props) => {
    const {clickFunc, name, Comp, compName} = props
    return (
        <MenuItem onClick={clickFunc}>
            <IconButton onClick={clickFunc} name={compName} color="inherit">
                <Badge badgeContent={1} color="secondary">
                    <Comp />
                    {/* <ListAlt /> */}

                </Badge>
            </IconButton>

            <p>{name}</p>
        </MenuItem>
    )
}

export default NavMenuItem

// const NavMenuItem extends Component {
//   render() {
//     return (
//       <div>
        
//       </div>
//     )
//   }
// }
