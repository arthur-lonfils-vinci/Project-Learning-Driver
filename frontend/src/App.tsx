import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RoadRules from '@/pages/RoadRules';
import RoadRulesContent from '@/pages/RoadRulesContent';
import JourneyTracker from '@/pages/JourneyTracker';
import Achievements from '@/pages/Achievements';
import InstructorDashboard from '@/pages/InstructorDashboard';
import Profile from '@/pages/Profile';
import PrivateRoute from '@/components/auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="rules" element={<RoadRules />} />
        <Route path="rulesContent/:categoryId" element={<RoadRulesContent />} />
        <Route
          path="journey"
          element={
            <PrivateRoute>
              <JourneyTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="achievements"
          element={
            <PrivateRoute roles={['STUDENT']}>
              <Achievements />
            </PrivateRoute>
          }
        />
        <Route
          path="instructor"
          element={
            <PrivateRoute roles={['INSTRUCTOR']}>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
