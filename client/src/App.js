import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Landing />}></Route>
                <Route path='/login' element={<Login></Login>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
