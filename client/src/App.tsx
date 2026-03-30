import { Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <>
      <SocketProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </SocketProvider>
    </>
  );
}

export default App;
