import React from "react";
import "./styles/App.css"

import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Main from "./pages/Main";

function App() {
    const [data, setData] = React.useState(null);


    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/main" element={<Main />}/>
        </Routes>
  );
}

export default App;
