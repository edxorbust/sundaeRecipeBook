import { useState, useEffect, useContext, useSyncExternalStore } from "react";
import "./componentes.css";
import config from "../config";
import { UserContext } from "../context/CUserProvider";

function RecipeShower() {
  const [idIng, setIdIng] = useState(0);
  const [editIng, setEditIng] = useState(false);
  const [prep_time, setPrep_time] = useState(0);
  const [ingAdded, setIngAdded] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [ingListRec, setIngListRec] = useState([]);
  const [nameIng, setNameIng] = useState("");
  const [showIng, setShowIng] = useState(true);
  const [edit, setEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [inRecipe, setInRecipe] = useState(false);
  const [notFound, setNotFound] = useState("");
  const [itemsFiltered, setItemsFiltered] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [warning, setWarning] = useState("");
  const apiUrl = config[import.meta.env.MODE].apiUrl;
  const { user, user_id, setUser_id } = useContext(UserContext);

  useEffect(() => {
    const RecipesUrl = apiUrl + "/recipes";
    // Realizar la solicitud HTTP para obtener los datos de la base de datos
    const data = { username: user };
    fetch(RecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((recipes) => {
        // Almacenar los datos en el estado
        setItemsFiltered(recipes);
        setRecipes(recipes);
        const id = recipes[0]["user_id"];
        setUser_id(id);
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

  const handleAdd = () => {
    setNameIng(searchBar);
    setShowIng(false);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleDone = () => {
    setEdit(false);
  };

  const handleCancel = () => {
    setWarning("");
    setShowIng(true);
    setEditIng(false);
  };

  const handleEditSingle = (id, titleToEdit, prep_timeToEdit) => {
    setIdIng(id);
    const data = { id: id };
    setNameIng(titleToEdit);
    setPrep_time(prep_timeToEdit);
    const RecipesUrl = apiUrl + "/ing-recipes";
    // Realizar la solicitud HTTP para obtener los datos de la base de datos

    fetch(RecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((recipes) => {
        // Almacenar los datos en el estado
        setIngListRec(recipes.ingredients);
        setRecipeText(recipes.preparation);
        setShowIng(false);
        setEditIng(true);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  const handleAddIng = () => {
    setWarning("");
    setIngListRec((prev) => [...prev, ingAdded]);
  };

  const handleSave = () => {
    if (ingListRec.length === 0) {
      // La lista está vacía, abortar la función
      setWarning("Add at least 1 ingredient");
      return;
    }
    const saveRecipesUrl = apiUrl + "/add-recipes";
    const data = {
      name: nameIng,
      prep_time: prep_time,
      ingredients: ingListRec,
      preparation: recipeText,
      user_id: user_id,
    };

    fetch(saveRecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Verificar si la respuesta fue exitosa
        if (response.ok) {
          // Realizar las acciones necesarias en caso de éxito
          setWarning("");
          setRefresh(true);
          setShowIng(true);
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

  const handleSaveEdit = () => {
    if (ingListRec.length === 0) {
      // La lista está vacía, abortar la función
      setWarning("Add at least 1 ingredient");
      return;
    }
    const editRecipesUrl = apiUrl + "/edit-recipes";
    const data = {
      id: idIng,
      name: nameIng,
      prep_time: prep_time,
      ingredients: ingListRec,
      preparation: recipeText,
      user_id: user_id,
    };

    fetch(editRecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Verificar si la respuesta fue exitosa
        if (response.ok) {
          // Realizar las acciones necesarias en caso de éxito
          setWarning("");
          setRefresh(true);
          setShowIng(true);
          setEditIng(false);
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

  const handleInputChange = (event) => {
    setRecipeText(event.target.value);
  };

  const handleDeleteIngredient = (index) => {
    const updatedList = [...ingListRec];
    updatedList.splice(index, 1);
    setIngListRec(updatedList);
  };

  const handleRecipeIn = (id, name, prep_time) => {
    setIdIng(id);
    const data = { id: id };
    setNameIng(name);
    setPrep_time(prep_time);
    const RecipesUrl = apiUrl + "/ing-recipes";
    fetch(RecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((recipes) => {
        // Almacenar los datos en el estado
        setIngListRec(recipes.ingredients);
        setRecipeText(recipes.preparation);
        setShowIng(false);
        setEditIng(false);
        setInRecipe(true);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  const handleBack = () => {
    setShowIng(true);
    setInRecipe(false);
  };

  const handleDelete = () => {
    const deleteRecipesUrl = apiUrl + "/delete-recipes";
    const data = {
      id: idIng,
      name: nameIng,
      prep_time: prep_time,
    };

    fetch(deleteRecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Verificar si la respuesta fue exitosa
        if (response.ok) {
          // Realizar las acciones necesarias en caso de éxito
          setWarning("");
          setRefresh(true);
          setShowIng(true);
          setEditIng(false);
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
    var searchResults = recipes.filter((item) => {
      if (
        item.name.toString().toLowerCase().includes(itemSearched.toLowerCase())
      ) {
        return item;
      }
    });
    setItemsFiltered(searchResults);
    if (searchResults.length === 0) {
      setNotFound("Recipe missing :c");
    }
  };

  return (
    <>
      {showIng && !editIng && (
        <div>
          <div className="search-bar">
            <input
              value={searchBar}
              onChange={handleChange}
              type="text"
              placeholder="Search or add a recipe"
            ></input>
          </div>
          <div>
            <p className="font-keys">{notFound}</p>
            {notFound.length !== 0 ? (
              <button onClick={handleAdd} className="add-button">
                Add
              </button>
            ) : null}
          </div>
          {!notFound ? (
            <div>
              <button onClick={handleEdit} className="edit-button-main">
                Edit recipes
              </button>
              {edit ? (
                <button onClick={handleDone} className="edit-button-main">
                  Done
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="container-center excel-table">
            <table>
              <tbody>
                {notFound.length === 0 ? (
                  <tr className="font-fields">
                    <th className="columna-izq">Recipe</th>
                    <th className="columna-der">Prep. Time</th>
                  </tr>
                ) : null}

                {itemsFiltered.map((recipe) => (
                  <tr key={recipe.id} className="font-keys">
                    <td
                      onClick={() =>
                        handleRecipeIn(recipe.id, recipe.name, recipe.prep_time)
                      }
                      className="columna-izq"
                    >
                      {recipe.name}
                    </td>
                    <td className="columna-der">
                      {recipe.prep_time} min
                      {edit ? (
                        <button className="edit-button">
                          <img
                            onClick={() =>
                              handleEditSingle(
                                recipe.id,
                                recipe.name,
                                recipe.prep_time
                              )
                            }
                            className="pl-3"
                            src="./src/assets/edit-icon.png"
                          ></img>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!showIng && !editIng && !inRecipe && (
        <>
          <div className="container-center py-10">
            <p className="font-warning">{warning}</p>
            <p className="font-fields">Name: </p>
            <input
              className="font-keys text-center"
              value={nameIng}
              onChange={(e) => setNameIng(e.target.value)}
            ></input>
            <p className="font-fields">Prep Time (min): </p>
            <input
              className="font-keys text-center"
              type="number"
              min="0"
              value={prep_time}
              onChange={(e) => setPrep_time(e.target.value)}
            ></input>
            <h3 className="font-fields">Ingredients</h3>
            <ul>
              {ingListRec.map((ing, index) => (
                <li key={index} className="font-keys">
                  {ing}{" "}
                  <button
                    className="pl-3"
                    onClick={() => handleDeleteIngredient(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <input
              className="font-keys text-center mt-5"
              type="text"
              value={ingAdded}
              onChange={(e) => setIngAdded(e.target.value)}
              placeholder="Enter a ingredient"
            ></input>
            <button onClick={handleAddIng} className="edit-button-main mt-3">
              Add ingredient
            </button>
            <textarea
              className="font-keys mt-5"
              value={recipeText}
              onChange={handleInputChange}
              placeholder="Preparation of the recipe"
            />
          </div>
          <div>
            <button onClick={handleSave} className="edit-button-main">
              Save
            </button>
            <button onClick={handleCancel} className="edit-button-main">
              Cancel
            </button>
          </div>
        </>
      )}
      {!showIng && editIng && (
        <>
          <div className="container-center py-10">
            <p className="font-warning">{warning}</p>
            <p className="font-fields">Name: </p>
            <input
              className="font-keys text-center"
              value={nameIng}
              onChange={(e) => setNameIng(e.target.value)}
            ></input>
            <p className="font-fields">Prep Time (min): </p>
            <input
              className="font-keys text-center"
              type="number"
              min="0"
              value={prep_time}
              onChange={(e) => setPrep_time(e.target.value)}
            ></input>
            <h3 className="font-fields">Ingredients</h3>
            <ul>
              {ingListRec.map((ing, index) => (
                <li key={index} className="font-keys">
                  {ing}{" "}
                  <button
                    className="pl-3"
                    onClick={() => handleDeleteIngredient(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <input
              className="font-keys text-center mt-5"
              type="text"
              value={ingAdded}
              onChange={(e) => setIngAdded(e.target.value)}
              placeholder="Enter a ingredient"
            ></input>
            <button onClick={handleAddIng} className="edit-button-main mt-3">
              Add ingredient
            </button>
            <textarea
              className="font-keys mt-5"
              value={recipeText}
              onChange={handleInputChange}
              placeholder="Preparation of the recipe"
            />
          </div>
          <div>
            <button onClick={handleSaveEdit} className="edit-button-main">
              Save
            </button>
            <button onClick={handleCancel} className="edit-button-main">
              Cancel
            </button>
            <button onClick={handleDelete} className="edit-button-main">
              Delete
            </button>
          </div>
        </>
      )}
      {!showIng && !editIng && inRecipe && (
        <>
          <div className="container-center py-10">
            <p className="font-fields">{nameIng}</p>

            <p className="font-keys">{prep_time}</p>

            <h3 className="font-fields">Ingredients</h3>
            <ul>
              {ingListRec.map((ing, index) => (
                <li key={index} className="font-keys">
                  {ing}
                </li>
              ))}
            </ul>
            <h3 className="font-fields">Preparation</h3>
            <p className="font-keys">{recipeText}</p>
          </div>
          <div>
            <button onClick={handleBack} className="edit-button-main">
              Back
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default RecipeShower;
