import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TeacherD from './pages/Teachers/TeacherD';
import Summary from './pages/Summary/Summary';
import StudentsDashboard from './pages/Students/StudentsDashboard';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/teachers-dashboard" element={<TeacherD />} />
          <Route path="/students-dashboard" element={<StudentsDashboard />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/*" element={<Navigate to="/summary" replace />} />
        </Routes>
      </Router>
  )
}

export default App
