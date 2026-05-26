import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";

import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;