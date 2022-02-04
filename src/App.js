import { Link, Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';

import './App.css';

function App() {
   return (
      <>
         <Link to='/login'>Go to login</Link>
         <button>Hey bro</button>
         <Routes>
            <Route path='/login' element={<Login />} />
         </Routes>
      </>
   );
}

export default App;
