import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/CUserProvider";

function RegisteringUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { registerUser, message, setMessage } = useContext(UserContext);

  const handleRegister = () => {
    setMessage("");
    setShowAlert(false);
    if (password === confirmPassword) {
      const userData = {
        username: username,
        password: password,
      };
      registerUser(userData);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="pt-10">
      <p>{message}</p>
      {showAlert && <div className="alert">Password doesnt match</div>}
      <h3 className="font-fields">Please fill some info</h3>
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
        <input
          type="password"
          className="mb-3"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        ></input>
        <button className="add-button" onClick={handleRegister}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default RegisteringUser;
