import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./auth/AuthContext";
import { EventProvider } from "./events/EventContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home';
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <AppRoutes />
            <ToastContainer/>
          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}
