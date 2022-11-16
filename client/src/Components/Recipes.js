import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { LocalGroceryStore, HourglassTop, Restaurant, Scale } from '@mui/icons-material';
import Ingredients from './Ingredients';
import '../Styles/Recipes.css'

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [groceryList, setGroceryList] = useState([]);
    
    useEffect(() => {
        getRecipes();
    },[]);

    async function getRecipes () {
        const app_id = '59482d1c';
        const app_key = '6708bc487e05e9385e5d27f95ed728f3';
        const fetchedIngredientsList = await axios.get('/ingredients');
        const ingredientsList = fetchedIngredientsList.data.map((ingredient) => {
            return ingredient.name 
        });

        const spacedIngredients = ingredientsList.join('%20and%20').toLowerCase();
        const fetchedRecipeList = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${spacedIngredients}&app_id=${app_id}&app_key=${app_key}`);
        const recipeList = fetchedRecipeList.data.hits.map((item) => {
            console.log(item.recipe)
            const recipe = item.recipe
            const name = recipe.label;
            const calories = recipe.calories;
            const image = recipe.image;
            const recipeIngredients = recipe.ingredientLines;
            const cookTime = recipe.totalTime;
            const servings = recipe.yield;
            const source = recipe.url;

            return  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
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
                                        <b>Calories per serving: { Math.floor(calories/servings) }</b>
                                    </Card>
                                </div>
                            <p><b>Ingredients:</b> { recipeIngredients.join(', ') } </p>
                            </div> 
                    <div className='recipe__buttons__container'>
                        <Button
                            variant='contained'
                            href={ source }
                            >View Recipe
                        </Button>
                        <IconButton
                            variant='contained'
                            color="primary"
                            aria-label="add to shopping cart">
                            <LocalGroceryStore sx={{ fontSize: 40 }}/>
                        </IconButton>
                    </div>
                        </div>
                    </div>
                </Card>
            </TableCell>
        </TableRow>
        });
        setRecipes(recipeList);
        console.log(recipeList);
    };
    

    return <div className='recipes__page'>
        <Ingredients/>
        <div className='recipes__container'>
            <TableContainer style={{maxHeight:'inherit', maxWidth:'inherit', boxSizing:'border-box'}} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>RESULTS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { recipes }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>
};

export default Recipes;