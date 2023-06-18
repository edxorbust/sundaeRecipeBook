import "./App.css";
import UserProvider from "./context/CUserProvider";
import AppRouter from "./componentes/AppRouter";

function App() {
  return (
    <UserProvider>
      <AppRouter/>
    </UserProvider>
  );
}

export default App;
