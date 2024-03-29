import '../Styles/UserInput.css'
import React, { useState } from 'react';
import axios from 'axios';
import Pantry from './Pantry';
import Ingredients from './Ingredients';
import { Button, IconButton, InputLabel, OutlinedInput, Card } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { getUid } from './userTokenManager';

const UserInput = () => {
    const [name, setName] = useState('');
    // const [searchToggle, setSearchToggle] = useState(true);
    let [change, setChange] = useState(true);

    const onSubmitForm = async () => {
            try {
                const test = await axios.post('/pantry', { uid: getUid(), name : name, timestamp : new Date() });
                console.log(test);
            } catch (error) {
                console.log(error)
            };
    };

    return <div className='home__top'>
        <div className='user__input__container'>
            <Card raised={true} className='input__and__buttons__container'>
                <div className='input__container'>
                    <InputLabel htmlFor="my-input">Add items to your Pantry</InputLabel>
                    <OutlinedInput
                        onChange={(e) => {
                            e.preventDefault();
                            setName(e.target.value);
                            }
                        } 
                        id="my-input"
                        aria-describedby="my-helper-text"
                        />
                </div>
                
                <div className='add__button__container'>
                    <Button
                        onClick={(e) => {
                            onSubmitForm();
                            setChange(!change);
                        }}
                        variant='contained'
                        style={{marginRight: '3%'}}
                        component="label">
                        Add
                    </Button>
                    <Button 
                        variant='contained'
                        component="label">
                        Receipt
                        <input hidden accept="image/*" multiple type="file" />
                    </Button>
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label">
                        <input
                            hidden accept="image/*"
                            type="file" />
                        <PhotoCamera />
                    </IconButton>
                </div>
            </Card>
            <Ingredients
                setChange = { setChange }
                change = { change }
            />
        </div>
        <Pantry setChange = { setChange } change = { change }/>
    </div>
    ;
};

export default UserInput;