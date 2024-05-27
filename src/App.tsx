import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Summary from './pages/Summary/Summary';
import StudentsDashboard from './pages/Students/StudentsDashboard';
import TeachersDashboard from './pages/Teachers/TeachersDashboard';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/teachers-dashboard" element={<TeachersDashboard />} />
          <Route path="/students-dashboard" element={<StudentsDashboard />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/*" element={<Navigate to="/summary" replace />} />
        </Routes>
      </Router>
  )
}

export default App
