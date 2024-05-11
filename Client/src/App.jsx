import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Input from "./components/Input/Input";
import Navbar from "./components/NavBar/NavBar";
import SlideShow from "./components/SlideShow/SlideShow";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Input />
      </div>
      <Routes>
        <Route path="/slideShow" element={<SlideShow />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
