import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs"); 

app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/GetFood", async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        const mealData = response.data;
        const meal = mealData.meals[0];

        const mealName = meal.strMeal;
        const mealInstructions = meal.strInstructions;
        const mealImage = meal.strMealThumb;

        const mealIngredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                mealIngredients.push({ ingredient, measure });
            }
        }

        console.log(mealName);
        console.log(mealIngredients);
        console.log(mealInstructions);
        

        res.render("index", {meal, mealName, mealInstructions, mealImage, mealIngredients }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo data de la API.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
