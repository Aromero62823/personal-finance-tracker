import Navbar from "./Navbar";
import { Route, Routes } from "react-router";
import Home from "./Home";

export default function App () {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path='/home/' element={<Home />} />
        </Routes>
        </>
    )
}