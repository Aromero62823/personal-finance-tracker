import Navbar from "./Navbar";
import { Route, Routes } from "react-router";
import Home from "./Home";
import Transaction from "./Transaction";
import History from "./History";

export default function App () {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path='/home/' element={<Home />} />
            <Route path='/home/transactions/' element={<Transaction />} />
            <Route path='/home/history/' element={<History />} />
            <Route path="/logout/" />
        </Routes>
        </>
    )
}