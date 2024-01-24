import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Navbar from "./component/Navbar";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container my-3">
          <Routes>
            <Route path="/Signup" element={<Signup />}></Route>
            <Route path="/Login" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
      {/* <Signup></Signup> */}
      {/* <Login></Login> */}
    </>
  );
}

export default App;
