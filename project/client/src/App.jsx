import Homepage from "./Homepage";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router";

export default function App () {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path='/home/' element={<Homepage />} />
        </Routes>
        </>
    )
}