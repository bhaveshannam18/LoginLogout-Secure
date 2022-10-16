import React, { useState } from 'react'
import {AppBar,Toolbar,Typography,Box,Tabs,Tab} from "@mui/material";
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import {authActions} from "../store";
axios.defaults.withCredentials = true;

const Header = () => {
    const [value,setValue] = useState();
    const isLoggedIn = useSelector(state=>state.isLoggedIn);
    const dispacth = useDispatch();

    const sendLogoutReq = async ()=>{
        const res = await axios.post("http://localhost:8000/api/logout",null,{
            withCredentials:true
        })
        if(res.status==200){
            return res;
        }
        return new Error("Unable to Logout");
    }
    const handleLogout = ()=>{
        sendLogoutReq().then(()=>dispacth(authActions.logout()))
    }
  return (
    <div>
        <AppBar position='sticky'>
            <Toolbar>
                <Typography variant="h3">MernAuth</Typography>
                <Box sx={{marginLeft:"auto"}}>
                    <Tabs 
                    onChange={(e,val)=>setValue(val)} 
                    value={value} 
                    textColor="inherit"
                    indicatorColor='secondary'
                    >
                        {!isLoggedIn && <><Tab to="/login" LinkComponent={Link} label="Login"/>
                        <Tab to="/signup" LinkComponent={Link} label="SignUp"/> </>}
                        {isLoggedIn && <Tab onClick={handleLogout} to="/" LinkComponent={Link} label="Logout"/>}{" "}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Header