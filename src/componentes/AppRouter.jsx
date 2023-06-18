import Navbar from "./Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Ingredients from "../paginas/Ingredients";
import RegisteringUser from "./RegisteringUser";
import LogingUser from "./LogingUser";
import { useContext } from "react";
import { UserContext } from "../context/CUserProvider";
import RecipeShower from "./RecipeShower";
import ShoppingList from "./ShoppingList";

function AppRouter() {
  const { logOutOption } = useContext(UserContext);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {logOutOption ? (
            <Route path="/" element={<RecipeShower />} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
          {logOutOption ? (
            <Route path="/ingredients" element={<Ingredients />} />
          ) : (
            <Route path="/ingredients" element={<Navigate to="/login" />} />
          )}
          {logOutOption ? (
            <Route path="/recipes" element={<RecipeShower />} />
          ) : (
            <Route path="/recipes" element={<Navigate to="/login" />} />
          )}
          {logOutOption ? (
            <Route path="/shopping-list" element={<ShoppingList />} />
          ) : (
            <Route path="/shopping-list" element={<Navigate to="/login" />} />
          )}
          <Route path="/register" element={<RegisteringUser />} />
          <Route path="/login" element={<LogingUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;
