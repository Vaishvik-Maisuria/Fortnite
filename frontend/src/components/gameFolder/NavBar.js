import React from 'react';
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'


const NavBar = () => {
    return (
        <div>
            <AppBar positoin="statiic">
                <ToolBar>
                    <Typography variant="title" color="inherit">
                        Fortnite-II
                    </Typography>
                </ToolBar>
            </AppBar>
        </div>
    )
}

export default NavBar;