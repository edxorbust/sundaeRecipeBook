import { useState, useEffect, useContext } from "react";
import "./componentes.css";
import config from "../config";
import { UserContext } from "../context/CUserProvider";

function ShoppingList() {
  const apiUrl = config[import.meta.env.MODE].apiUrl;
  const [ingList, setIngList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user, user_id, setUser_id } = useContext(UserContext);

  useEffect(() => {
    const shoppingIngUrl = apiUrl + "/shopping";
    // Realizar la solicitud HTTP para obtener los datos de la base de datos
    const data = { username: user };
    fetch(shoppingIngUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((ingredients) => {
        // Almacenar los datos en el estado
        setIngList(ingredients);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const handleAddtoIng = (id, name, recipe) => {
    const addIngredientUrl = apiUrl + "/add-ingredients";
    // Realizar la solicitud HTTP para obtener los datos de la base de datos
    const data = { user_id: user_id, id: id, name: name, recipe: recipe };
    fetch(addIngredientUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Verificar si la respuesta fue exitosa
        if (response.ok) {
          // Realizar las acciones necesarias en caso de éxito
          setRefresh(true);
        } else {
          // Mostrar un error en la consola en caso de que la respuesta no sea exitosa
          console.error("Error al guardar los datos");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  return (
    <div>
      <div className="container-center">
        <table className="shopping">
          <thead>
            <tr className="font-fields">
              <th>
                Ingredient
              </th>
              <th>
                Recipe
              </th>
            </tr>
          </thead>
          <tbody>
          {ingList.map((ingredient) => (
            <tr key={ingredient.id} className="font-keys">
              <td>{ingredient.name}</td>
              <td>{ingredient.recipe_name}</td>
              <button
                onClick={() =>
                  handleAddtoIng(
                    ingredient.id,
                    ingredient.name,
                    ingredient.recipe_name
                  )
                }
              >
                X
              </button>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShoppingList;
