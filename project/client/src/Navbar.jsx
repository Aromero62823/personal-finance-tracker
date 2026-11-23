import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { Link } from 'react-router';
import './style.css';

export default function Navbar() {
    return (
        <>
        <title>Personal Finance Tracker</title>
        <nav className="navbar navbar-expand-lg bg-light navbar-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-arms-up" viewBox="0 0 16 16">
                <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
            </svg>

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link" to="/home/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/home/transactions/">Add Transaction</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/home/history/">History</Link>
                </li>
            </ul>

            <div className="d-flex">
                <Link className="btn btn-outline-danger" to="/logout">Logout</Link>
            </div>
        </nav>
        </>
    )
}