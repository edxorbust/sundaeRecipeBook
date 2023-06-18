# YOUR PROJECT TITLE
#### Video Demo:  <https://youtu.be/Bv3xbXvhavU>
#### Description:

## Title of the app
The app's name is Sundae's Recipe Book. It was named in honor of my cat whose name is Sundae.

## Main Features
This app lets you enter a recipe including ingredients, preparation and preparation time, so you will know what ingredients you are always using when you are cooking and for which specific ingredient belongs each ingredient, this app will show you a list of ingredients that you currently have with the recipe that they belong, and a list of ingredients that you will need to buy for specific recipes. So you wont forget what to buy at your next visit to the grocery store.
If you are out of an ingredient, you can just delete the ingredient and that will create another item to the shopping list.

## Basic Usage
    1.- Create an account (if arent logged in the app wont let you use any feature besides the register and log-in options) 
    2.- Log in with your recently created username and password
    3.- Create a recipe including all details (ingredients, preparation, preparation time) the app will create an item into the shopping list if you dont have the ingredient already for that recipe
after the 4th step is up to the user to use the other features, if you delete an item from the shopping list it will create an item in the ingredients storage and if you delete an item from the ingredients storage it will create an item in the shopping list.

## Why React (javascript) with Flask (python)?
I chose to use React because I needed a library that would allow me to make changes to each page of the app without having to reload the entire page, and this is one of React's main features. It makes use of state and re-renders whenever there is a change in the state. Another reason was that I needed the ability to reuse components anywhere on each page of the app, so I wouldn't have to rewrite code for the same purpose. Additionally, I could practice and learn about all the features of this famous JavaScript library.

I chose to use Flask because I was familiar with it since I used it for a course assignment, and I considered it sufficient for this type of app. Other options like Django were too extensive for this type of app.

## Components description

### App Router
This component is responsible for redirecting the user to different areas of the app using the Navbar component, as well as restricting access to the user when they haven't logged in.

### IngShower
This component is responsible for show the ingredients that the user already have, in other words, the ingredients that were deleted from the shopping list. Also you this component will send an ingredient back to the shopping list if the user delete it.

### LogingUser
This component is responsible for logging in the user

### Navbar
This component allows the user to navigate through the app

### RecipeShower
This component is responsable for show all the recipes that the user currently has and its capable of edit the recipe's details, also if the recipe that the user its adding or editing has an ingredient that is not in the ingredients list already, it will send the ingredient to the shopping list.

### RegisteringUser
This component allows the user to register, rejecting usernames that are already in the database

### ShoppingList
This component will show the user the ingredients that are missing from recipes and need to be buy it.

## Why I Decided To Make This App?
I decided to create this app because I always had the problem of forgetting what I needed and why I needed it when I went grocery shopping weekly. So, I wanted to solve that problem, and I know that this app will be quite useful in my day-to-day life.