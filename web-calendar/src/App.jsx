import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WelcomePage from "./components/welcomePage/WelcomePage";
import AppContent from "./AppContent";
import { useAppState } from "./AppStateContext";
import { auth } from "../firebase";

function App() {
  const { user, setUser } = useAppState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route
          path="/"
          element={user ? <AppContent /> : <Navigate to="/welcome" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
