import { createContext, useState, useEffect } from "react";
import config from "../config";

export const UserContext = createContext();
const apiUrl = config[import.meta.env.MODE].apiUrl;

const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [user_id, setUser_id] = useState(0);
  const [message, setMessage] = useState("");
  const [logOutOption, setLogOutOption] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");
    const user_idA = localStorage.getItem("user_id");
    // Actualizar el estado del usuario en el componente si está autenticado
    if (isLoggedIn && username && user_idA) {
      setUser(username);
      setLogOutOption(true);
      setUser_id(user_idA);
    }
  }, []);

  const registerUser = (userData) => {
    const registerUrl = apiUrl + "/register";
    return new Promise((resolve, reject) => {
      fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          // Verificar si la respuesta fue exitosa
          if (response.ok) {
            // Realizar las acciones necesarias en caso de éxito
            setMessage("User registered, now you can log in!");
            resolve(response);
          } else {
            // Verificar el código de estado de la respuesta
            if (response.status === 409) {
              // Mostrar un mensaje de error específico si el usuario ya existe
              setMessage("Username is already taken");
              reject(new Error("Error registering the user."));
            } else {
              // Mostrar un mensaje de error genérico para otros errores de solicitud
              setMessage("Error registering the user.");
              reject(new Error("Error registering the user."));
            }
          }
        })
        .catch((error) => {
          // Mostrar un error en la consola en caso de que ocurra un error en la solicitud
          console.error("Error en la solicitud:", error);
          reject(new Error("Error registering the user."));
        });
    });
  };

  

  const logoutUser = () => {
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", false);
    setUser("");
    setLogOutOption(false);
  };

  return (
    <UserContext.Provider
      value={{ user, registerUser, setMessage, message, logoutUser, logOutOption, user_id, setUser_id, setUser, setLogOutOption }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
