import Navbar from "./Navbar";
import { Route, Routes } from "react-router";
import Home from "./Home";
import Transaction from "./Transaction";

export default function App () {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path='/home/' element={<Home />} />
            <Route path='/home/transactions/' element={<Transaction />} />
        </Routes>
        </>
    )
}