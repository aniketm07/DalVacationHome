import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/common/LoginPage";
import SignUpPage from "./pages/common/SignUpPage";
import SecurityQuestionPage from "./pages/common/SecurityQuestionPage";
import Dashboard from "./pages/guests/Dashboard";
import AgentDashboard from "./pages/agents/AgentDashboard";
import Landing from "./pages/common/Landing";
import CipherPage from "./pages/common/CipherPage";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Error404 from "./pages/common/Error404";
import RoomDetailsForm from "./components/agents/RoomDetailsForm";
import UpdateRoomDetailsForm from "./components/agents/UpdateRoomDetailsForm";
import TicketChat from "./pages/common/TicketChat";
import RoomOverview from "./pages/common/RoomOverview";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage role="GUEST" />} />
          <Route path="/agent/login" element={<LoginPage role="AGENT" />} />
          <Route path="/agent/signup" element={<SignUpPage role="AGENT" />} />
          <Route path="/signup" element={<SignUpPage role="GUEST" />} />
          <Route
              path="/form"
              element={<ProtectedRoute element={<RoomDetailsForm />} requiredRole="AGENT" />}
          />
          <Route
              path="/addform"
              element={<ProtectedRoute element={<UpdateRoomDetailsForm />} requiredRole="AGENT" />}
          />
          <Route
            path="/security-question"
            element={<SecurityQuestionPage role="GUEST" />}
          />
          <Route
            path="/agent/security-question"
            element={<SecurityQuestionPage role="AGENT" />}
          />
          <Route path="/agent/cipher" element={<CipherPage role="AGENT" />} />
          <Route path="/cipher" element={<CipherPage role="GUEST" />} />
          {/* Protect routes */}
          <Route
            path="/agent/dashboard"
            element={<ProtectedRoute element={<AgentDashboard />} requiredRole="AGENT" />}
          />
          <Route
              path="/update-room/:roomId"
              element={<ProtectedRoute element={<UpdateRoomDetailsForm />} requiredRole="AGENT" />}
          />
          <Route
              path="/room-details-form"
              element={<ProtectedRoute element={<RoomDetailsForm  />} requiredRole="AGENT" />}
          />
           <Route
            path="/chat"
            element={<ProtectedRoute element={<TicketChat />} requiredRole="" />}
          />
          {/* All other routes */}
          <Route path="*" element={<Error404 />} />
          <Route path="/error" element={<Error404 />} />
          <Route path="/rooms" element={<Dashboard />} />
          <Route path="/room/:roomId" element={<RoomOverview />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
