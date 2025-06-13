import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./auth/AuthContext";
import { EventProvider } from "./events/EventContext";
import { NotificationProvider } from "./notifications/NotificationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </NotificationProvider>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}
