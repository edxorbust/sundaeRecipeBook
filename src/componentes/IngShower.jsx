import { useState, useEffect, useContext } from "react";
import "./componentes.css";
import config from "../config";
import { UserContext } from "../context/CUserProvider";

function IngShower() {
  const [idIng, setIdIng] = useState(0);

  const [edit, setEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notFound, setNotFound] = useState("");
  const [itemsFiltered, setItemsFiltered] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const apiUrl = config[import.meta.env.MODE].apiUrl;
  const { user, user_id, setUser_id } = useContext(UserContext);


  useEffect(() => {
    const ingredientsUrl = apiUrl + "/ingredients";
    // Realizar la solicitud HTTP para obtener los datos de la base de datos
    const data = {'user_id':user_id}
    fetch(ingredientsUrl,  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((ingredients) => {
        // Almacenar los datos en el estado
        setItemsFiltered(ingredients);
        setIngredients(ingredients);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    if (refresh) {
      setSearchBar("");
      setNotFound("");
      setRefresh(false);
    }
  }, [refresh]);

  const handleChange = (e) => {
    setNotFound("");
    setSearchBar(e.target.value);
    buscar(e.target.value);
  };

 

  const handleEdit = () => {
    setEdit(true);
  };

  const handleDone = () => {
    setEdit(false);
  };


  const handleDelete = (id, name, recipe) => {
    const deleteIngredientsUrl = apiUrl + "/delete-ingredients";
    const data = {
      user_id:user_id,
      id: id,
      name: name,
      recipe: recipe
    };

    fetch(deleteIngredientsUrl, {
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
        // Mostrar un error en la consola en caso de que ocurra un error en la solicitud
        console.error("Error en la solicitud:", error);
      });
  };

  const buscar = (itemSearched) => {
    var searchResults = ingredients.filter((item) => {
      if (
        item.name.toString().toLowerCase().includes(itemSearched.toLowerCase())
      ) {
        return item;
      }
    });
    setItemsFiltered(searchResults);
    if (searchResults.length === 0) {
      setNotFound("You dont have that ingredient :c");
    }
  };

  return (
    <>
        <div>
          <div className="search-bar">
            <input
              value={searchBar}
              onChange={handleChange}
              type="text"
              placeholder="Search an ingredient"
            ></input>
          </div>
            <div>
              <button onClick={handleEdit} className="edit-button-main">
                Delete
              </button>
              {edit ? (
                <button onClick={handleDone} className="edit-button-main">
                  Done
                </button>
              ) : null}
            </div>
          <div className="container-center excel-table">
            <table>
              <tbody>
                  <tr className="font-fields">
                    <th>Ingredient</th>
                    <th>Recipe</th>
                  </tr>
                {itemsFiltered.map((ingredient) => (
                  <tr key={ingredient.id} className="font-keys">
                    <td>{ingredient.name}
                    {edit ? (
                        <button onClick={() =>
                          handleDelete(
                            ingredient.id,
                            ingredient.name,
                            ingredient.recipe
                          )
                        } className="ml-5 font-keys">X</button>
                      ) : null}
                    </td>
                    <td>{ingredient.recipe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  );
}

export default IngShower;
