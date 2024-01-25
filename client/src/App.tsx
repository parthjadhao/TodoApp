import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Navbar from "./component/Navbar";
import Landingpage from "./component/Landingpage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container my-3">
          <Routes>
            <Route path="/Signup" element={<Signup />}></Route>
            <Route path="/Login" element={<Login />}></Route>
            <Route path="/" element={<Landingpage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
