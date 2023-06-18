import { useState, useContext } from "react";
import { UserContext } from "../context/CUserProvider";
import config from "../config";

function LogingUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = config[import.meta.env.MODE].apiUrl;
  const {
    message,
    setMessage,
    logoutUser,
    logOutOption,
    user,
    setUser_id,
    setUser,
    setLogOutOption,
    user_id,
  } = useContext(UserContext);

  const loginUser = (userData) => {
    const loginUrl = apiUrl + "/login";
    fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error logging in.");
        }
      })
      .then((userResponse) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("username", userData["username"]);
        localStorage.setItem("user_id", userResponse["user_id"]);
        setUser_id(userResponse["user_id"]);
        setUser(userData["username"]);
        setLogOutOption(true);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        setMessage("Error logging in.");
      });
  };

  const handleLogin = () => {
    setMessage("");
    const userData = {
      username: username,
      password: password,
    };
    loginUser(userData);
  };

  return (
    <div className="pt-10">
      {logOutOption ? (
        <div>
          <h3 className="font-keys">Hi {user}! You are logged in!</h3>
          <button className="add-button mt-5" onClick={logoutUser}>
            Log Out
          </button>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3 className="font-fields">Log In</h3>
          <div className="pt-5 font-keys container-center">
            <input
              className="mb-3"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            ></input>
            <input
              type="password"
              className="mb-3"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            ></input>
            <button className="add-button" onClick={handleLogin}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogingUser;
