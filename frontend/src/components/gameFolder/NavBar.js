import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Accessibility from '@material-ui/icons/Accessibility';
import PlayArrow from '@material-ui/icons/PlayArrow';
import FullscreenExitRounded from '@material-ui/icons/FullscreenExitRounded';
import ListAlt from '@material-ui/icons/ListAlt';
import Description from '@material-ui/icons/Description';

import NavMenuItem from '../navMenuItem/navMenuItem'
import DesktopMenuItem from '../navMenuItem/desktopMenuItem'


const styles = theme => ({
    root: {
        width: "100%"
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing.unit * 3,
            width: "auto"
        }
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit",
        width: "100%"
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: 200
        }
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    }
});


class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null
        };
    }

    handlePlayMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.props.view("Game");
    };

    handleInstructionMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.props.view("Instruction");
    };

    handleStatsMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.props.view("Stats");
    };

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.props.view("Profile");
    };

    handleLogOutMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.props.view("LogOut");
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
        
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
    };

    render() {
        const { anchorEl, mobileMoreAnchorEl } = this.state;
        const { classes } = this.props;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={isMobileMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMobileMenuClose}>
                    {/* Number of Players */}
                    <IconButton color="inherit">
                        <Badge badgeContent={1} color="secondary">
                            <Accessibility />
                        </Badge>
                    </IconButton>
                    <p>Players</p>
                </MenuItem>
                <MenuItem onClick={this.handlePlayMenuOpen}>
                    <IconButton onClick={this.handlePlayMenuOpen} name="Game" color="inherit">
                        <Badge color="secondary">
                            <PlayArrow />
                        </Badge>
                    </IconButton>
                    <p>Play</p>
                </MenuItem>
                <MenuItem onClick={this.handleInstructionMenuOpen}>
                    <IconButton onClick={this.handleInstructionMenuOpen} name="Instruction" color="inherit">
                        <Badge color="secondary">
                            <Description />
                        </Badge>
                    </IconButton>
                    <p>Instruction</p>
                </MenuItem>
                <MenuItem onClick={this.handleStatsMenuOpen}>
                    <IconButton onClick={this.handleStatsMenuOpen} name="Stats" color="inherit">
                        <Badge badgeContent={1} color="secondary">

                            <ListAlt />

                        </Badge>
                    </IconButton>

                    <p>Stats</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton aria-haspopup="true" onClick={this.handleProfileMenuOpen} name="Profile" color="inherit">
                        <AccountCircle />

                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
                <MenuItem onClick={this.handleLogOutMenuOpen}>
                    <IconButton aria-haspopup="true" onClick={this.handleLogOutMenuOpen} name="LogOut" color="inherit">
                        <FullscreenExitRounded />

                    </IconButton>
                    <p>Logout</p>
                </MenuItem>
            </Menu>
        );
        
        return (
            <div className={classes.root}>

                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            Fortnite-II
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            {/* Number of Players */}
                            {/* <IconButton color="inherit">
                                <Badge badgeContent={1} color="secondary">
                                    <Accessibility />
                                    Players
                                    </Badge>
                            </IconButton> */}

                            {/* Play Button */}
                            <DesktopMenuItem 
                                clickFunc={this.handlePlayMenuOpen}
                                name={'Play'} compName={'Game'}
                                Comp={() => ( <PlayArrow /> )}
                            />

                            <DesktopMenuItem 
                                clickFunc={this.handleInstructionMenuOpen}
                                name={'Instruction'}
                                compName={'Instruction'}
                                Comp={() => ( <Description /> )}
                            />

                            <DesktopMenuItem 
                                clickFunc={this.handleStatsMenuOpen}
                                name={'Stats'}
                                compName={'Stats'}
                                Comp={() => ( <ListAlt /> )}
                            />

                            
                            <DesktopMenuItem 
                                clickFunc={this.handleProfileMenuOpen}
                                name={'Profile'}
                                compName={'Profile'}
                                Comp={() => ( <AccountCircle /> )}
                            />

                            <DesktopMenuItem 
                                clickFunc={this.handleLogOutMenuOpen}
                                name={'Logout'}
                                compName={'LogOut'}
                                Comp={() => ( <FullscreenExitRounded /> )}
                            />
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-haspopup="true"
                                onClick={this.handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>

                    </Toolbar>
                </AppBar>
                
                {renderMobileMenu}
            </div>
        );
    }
}

export default withStyles(styles)(NavBar);



