import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Home />
      </div>
    </AuthProvider>
  );
}

export default App;