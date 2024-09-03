// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Error, Register, ProtectedRoute } from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Profile,
  AddJob,
  AllJobs,
  Stats,
  SharedLayout,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route set to landing page */}
        <Route path='/' element={<Landing />} />

        {/* Register route */}
        <Route path='register' element={<Register />} />

        {/* Protected Routes for Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>

        {/* Error page route */}
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
