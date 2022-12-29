import '../Styles/Recipes.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { LocalGroceryStore, HourglassTop, Restaurant, Scale } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Recipes = ({ uid }) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    
    useEffect(() => {
        getRecipes();
    },[]);

    async function addToGroceryList (name, calories, image, recipeIngredients, source) {
        try {
            await axios.post('grocery_list', {
                    uid: uid,
                    name: name,
                    calories: calories,
                    ingredients_array: recipeIngredients,
                    recipe_source: source,
                    image_source: image
                });
        } catch (error) {
            console.log(error);
        }
    };

    async function getRecipes () {
        const app_id = '59482d1c';
        const app_key = '6708bc487e05e9385e5d27f95ed728f3';
        const fetchedIngredientsList = await axios.get(`/ingredients/${uid}`);
        const ingredientsList = fetchedIngredientsList.data.map((ingredient) => {
            return ingredient.name 
        });
        setIngredients(ingredientsList.map((ingredient) => {
            return <Button
                    disabled
                    color='success'
                    variant='contained'
                    size='small'
                    >x { ingredient }</Button>
        }));

        const spacedIngredients = ingredientsList.join('%20and%20').toLowerCase();
        const fetchedRecipeList = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${spacedIngredients}&app_id=${app_id}&app_key=${app_key}`);
        const recipeList = fetchedRecipeList.data.hits.map((item) => {
            const recipe = item.recipe
            console.log(recipe);
            const name = recipe.label;
            const image = recipe.image;
            const recipeIngredients = recipe.ingredientLines;
            const cookTime = recipe.totalTime;
            const servings = recipe.yield;
            const calories = Math.floor(recipe.calories/servings);
            const source = recipe.url;

            return  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell className='table__cell'>
                <Card className='recipe__data__container'>
                    <div className='recipe__info'>
                        <img className='food__image'  alt='recipe-photo' src={ image }/>
                        <div>
                            <div className='raw__data'>
                                <p className='recipe__name'>{ name }</p>
                                <div className='icons__container'>
                                    <Card className='icon__data'>
                                        <HourglassTop sx={{ fontSize: 50 }}/>
                                        <b>Cooking Time: { cookTime } min/s</b>
                                    </Card>
                                    <Card className='icon__data'>
                                        <Restaurant sx={{ fontSize: 50 }}/>
                                        <b>Servings: { servings }</b>
                                    </Card>
                                    <Card className='icon__data'>
                                        <Scale sx={{ fontSize: 50 }}/>
                                        <b>Calories per serving: { calories }</b>
                                    </Card>
                                </div>
                            <p><b>Ingredients:</b> { recipeIngredients.join(', ') } </p>
                            </div> 
                        </div>
                        <div className='recipe__buttons__container'>
                            <Button className='view__button'
                                variant='contained'
                                color='primary'
                                href={ source }
                                >View Recipe
                            </Button>
                            <IconButton
                                variant='contained'
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={() => {
                                    addToGroceryList(name, calories, image, recipeIngredients, source);
                                    navigate('/lists');
                                    }
                                }>
                                <LocalGroceryStore color='primary' sx={{ fontSize: 40 }}/>
                            </IconButton>
                        </div>
                    </div>
                </Card>
            </TableCell>
        </TableRow>
        });
        setRecipes(recipeList);
    };
    

    return <div className='recipes__page'>
        <div className='ingredients__container__plus'>
            <Button
                variant='contained'
                component='label'
                onClick={(e) =>{
                    e.preventDefault();
                    navigate('/home');
                }
            }>BACK</Button>
            {ingredients}
        </div>
        <div className='recipes__container' >
            <TableContainer elevation='5' sx={{height:'95%'}} component={Paper}>
                <Table>
                    <TableBody>
                        { recipes }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>
};

export default Recipes;