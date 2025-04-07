import './App.css'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import {Auth} from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { FinancialRecordProvider } from './contexts/financial-record-context';
import { SignedIn, UserButton } from '@clerk/clerk-react';

function App() {

  return (
    <>
    <Router>
      <div className='app-container'>
        <div className='navbar'>
          <Link to="/"> Dashboard</Link>
          <SignedIn>
            <UserButton showName/>
        </SignedIn>

        </div>
        <Routes>
          <Route path="/" element={<FinancialRecordProvider><Dashboard/></FinancialRecordProvider>}/>
          <Route path="/auth" element={<Auth/>}/>
        </Routes>
      </div>
    </Router>
      
    </>
  )
}

export default App
