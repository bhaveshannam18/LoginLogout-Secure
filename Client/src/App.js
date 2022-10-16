import React from 'react';
import './App.css';
import Header from './Componets/Header';
import {Routes ,Route} from "react-router-dom";
import Login from "./Componets/Login"
import Signup from "./Componets/Signup"
import Welcome from "./Componets/Welcome"
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector(state=>state.isLoggedIn);
  return (<>
  <React.Fragment>
    <header>
      <Header />
    </header>
    <main>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isLoggedIn && <Route path="/user" element={<Welcome />} />}
      </Routes>
    </main>
    </React.Fragment>
    </>
  );
}

export default App;
