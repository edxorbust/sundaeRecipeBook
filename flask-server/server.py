from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import sqlite3
import json
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Members API Route


@app.route("/ingredients", methods=['POST'])
@cross_origin()
def get_ingredients():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    rows = db.execute('SELECT * FROM ingredients WHERE user_id = ? ORDER BY name', (data['user_id'],))
    results = rows.fetchall()
    columns = [column[0] for column in db.description]
    conn.close()
    data = []
    for row in results:
        row_dict = dict(zip(columns, row))
        data.append(row_dict)
    print(data)
    return jsonify(data)
    
@app.route("/add-ingredients", methods=['POST'])
@cross_origin()
def add_ingredients():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    db.execute('INSERT INTO ingredients (name, recipe, user_id) VALUES (?,?,?)', (data['name'], data['recipe'], data['user_id']))
    db.execute('DELETE FROM missingIngredients WHERE id = ?', (data['id'],))
    conn.commit()
    conn.close()
    return make_response('', 204)


@app.route("/delete-ingredients", methods=['POST'])
@cross_origin()
def delete_ingredients():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    db.execute('DELETE FROM ingredients WHERE id = ?', (data['id'],))
    db.execute('INSERT INTO missingIngredients (name, recipe_name, user_id) VALUES (?,?,?)', (data['name'], data['recipe'], data['user_id']))
    conn.commit()
    conn.close()
    return make_response('', 204)

@app.route("/recipes", methods=['POST'])
@cross_origin()
def get_recipes():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    rows = db.execute('SELECT id FROM users WHERE username = ?', (data['username'],))
    results = rows.fetchone()
    user_id = results[0]
    rows = db.execute('SELECT * FROM recipes WHERE user_id = ? ORDER BY name', (user_id,))
    results = rows.fetchall()
    columns = [column[0] for column in db.description]
    conn.close()
    data = []
    for row in results:
        row_dict = dict(zip(columns, row))
        data.append(row_dict)
    print(data)
    return jsonify(data)

@app.route("/shopping", methods=['POST'])
@cross_origin()
def get_shopping():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    rows = db.execute('SELECT id FROM users WHERE username = ?', (data['username'],))
    results = rows.fetchone()
    user_id = results[0]
    rows = db.execute('SELECT * FROM missingIngredients WHERE user_id = ?', (user_id,))
    results = rows.fetchall()
    columns = [column[0] for column in db.description]
    conn.close()
    data = []
    for row in results:
        row_dict = dict(zip(columns, row))
        data.append(row_dict)
    print(data)
    return jsonify(data)

@app.route("/add-recipes", methods=['POST'])
@cross_origin()
def add_recipes():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    ingredients_json = json.dumps(data['ingredients'])
    db.execute('INSERT INTO recipes (name, prep_time, preparation, ingredients, user_id) VALUES (?,?,?,?,?)', (data['name'], data['prep_time'], data['preparation'], ingredients_json, data['user_id']))
    rows = db.execute('SELECT name FROM ingredients WHERE user_id = ?', (data['user_id'],))
    user_ingredients = rows.fetchall()
    user_ingredients = [row[0] for row in user_ingredients]
    missing_ingredients = []
    ingredients_list = data['ingredients']
    resultados = db.execute('SELECT name FROM missingIngredients WHERE recipe_name = ? AND user_id = ?', (data['name'], data['user_id']))
    actual_missingIngredients = resultados.fetchall()
    actual_missingIngredients = [row[0] for row in actual_missingIngredients]
    for ingredient in ingredients_list:
        if ingredient not in user_ingredients and ingredient not in actual_missingIngredients:
            missing_ingredients.append(ingredient)
    if missing_ingredients:
        for missingIngredient in missing_ingredients:
            db.execute('INSERT INTO missingIngredients (name, recipe_name, user_id) VALUES (?,?,?)', (missingIngredient, data['name'], data['user_id']))
    conn.commit()
    conn.close()
    return make_response('', 204)


@app.route("/edit-recipes", methods=['POST'])
@cross_origin()
def edit_recipes():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    ingredients_json = json.dumps(data['ingredients'])
    db.execute('UPDATE recipes SET name = ? , prep_time = ?, preparation = ?, ingredients = ? WHERE id = ?', (data['name'], data['prep_time'], data['preparation'], ingredients_json,  data['id']))
    rows = db.execute('SELECT name FROM ingredients WHERE user_id = ?', (data['user_id'],))
    user_ingredients = rows.fetchall()
    user_ingredients = [row[0] for row in user_ingredients]
    missing_ingredients = []
    ingredients_list = data['ingredients']
    resultados = db.execute('SELECT name FROM missingIngredients WHERE recipe_name = ? AND user_id = ?', (data['name'], data['user_id']))
    actual_missingIngredients = resultados.fetchall()
    actual_missingIngredients = [row[0] for row in actual_missingIngredients]
    for ingredient in ingredients_list:
        if ingredient not in user_ingredients and ingredient not in actual_missingIngredients:
            missing_ingredients.append(ingredient)
    if missing_ingredients:
        for missingIngredient in missing_ingredients:
            db.execute('INSERT INTO missingIngredients (name, recipe_name, user_id) VALUES (?,?,?)', (missingIngredient, data['name'], data['user_id']))
    conn.commit()
    conn.close()
    return make_response('', 204)


@app.route("/ing-recipes", methods=['POST'])
@cross_origin()
def get_ing_rec():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    rows = db.execute('SELECT ingredients, preparation FROM recipes WHERE id = ?', (data['id'],))
    results = rows.fetchone()
    ingredients_str = results[0]  # Obtiene la cadena de texto de la columna "ingredients"
    preparation = results[1]
    ingredients_list = json.loads(ingredients_str) # Convierte la cadena de texto en una lista
    response_data = {
        'ingredients':ingredients_list,
        'preparation':preparation
    }
    conn.commit()
    conn.close()
    return make_response(jsonify(response_data), 200)



@app.route("/delete-recipes", methods=['POST'])
@cross_origin()
def delete_recipes():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    db.execute('DELETE FROM recipes WHERE id = ?', (data['id'],))
    db.execute('DELETE FROM ingredients WHERE recipe = ?', (data['name'],))
    db.execute('DELETE FROM missingIngredients WHERE recipe_name = ?', (data['name'],))
    conn.commit()
    conn.close()
    return make_response('', 204)


@app.route("/register", methods=['POST'])
@cross_origin()
def register():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    username = data['username']
    existing_user = db.execute('SELECT username FROM users WHERE username = ?', (username,))
    result = existing_user.fetchone()
    if result is not None:
       conn.commit()
       conn.close()
       return make_response('', 409)
    # Agregar el nuevo usuario a la tabla users
    password = data['password']
    hashed_password = generate_password_hash(password)
    db.execute('INSERT INTO users (username, hash) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()
    return make_response('', 204)

@app.route("/login", methods=['POST'])
@cross_origin()
def login():
    conn = sqlite3.connect("./databases/recipebook.db")
    db = conn.cursor()
    data = request.get_json()
    username = data['username']
    result_user = db.execute('SELECT username FROM users WHERE username = ?', (username,))
    username_db = result_user.fetchone()
    if username_db is None:
        conn.commit()
        conn.close()
        return make_response('', 409)
    password = data['password']
    result_pass = db.execute('SELECT hash FROM users WHERE username = ?', (username,))
    hashpass = result_pass.fetchone()
    is_match = check_password_hash(hashpass[0], password)
    if is_match:
        result_id = db.execute('SELECT id FROM users WHERE username = ?', (username,))
        id_db = result_id.fetchone()
        conn.commit()
        conn.close()
        userData = {'user_id': id_db[0]}
        return make_response(jsonify(userData), 200)
    else:
        conn.commit()
        conn.close()
        return make_response('', 409)

if __name__ == "__main__":
    app.run(debug=True)
