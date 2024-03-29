import '../Styles/Pantry.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Paper } from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { getUid } from './userTokenManager';
import { IngredientsObj } from '../globals';

interface PantryProps {
    change: boolean;
    setChange: (arg0: boolean) => void;
};

const Pantry: React.FC<PantryProps> = ({ change, setChange }) => {
    const [pantryList, setPantryList] = useState([]);

    useEffect(() => {
        const getPantry = async () => {
            const fetchPantryList = await axios.get(`/pantry/${getUid()}`);
            const list = fetchPantryList.data.map((item: IngredientsObj) => {
                const uid = item.uid;
                const id = item.id;
                const name = item.name;
                const time = item.timestamp;
    
                return <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                        <Button
                            variant='outlined'
                            startIcon={<AddCircle/>}
                            onClick={() => {
                                addToIngredients(uid, id, name, time);
                                deleteItem(id);
                                }
                            }
                        ></Button>
                    </TableCell>
                    <TableCell><p>{ name }</p></TableCell>
                    <TableCell>{timeDuration(time)}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell align='right'>
                        <Button
                            variant='outlined'
                            startIcon={<Delete/>}
                            onClick={() => {
                                deleteItem(id);
                                }
                            }
                        ></Button>
                    </TableCell>
                </TableRow>
            });
            setPantryList(list);
        };
        async function deleteItem (id: string) {
            try {
                await axios.delete(`pantry/${id}`);
            } catch (error) {
                console.log(error);
            }
            setChange(!change);
        };
    
        async function addToIngredients (uid: string, id: string, name: string, time: Date) {
            try {
                await axios.post('/ingredients', { uid: uid, pantry_id: id, name : name, timestamp : time });
            } catch (error) {
                console.log(error)
            };
            setChange(!change);
        };
        getPantry();
    },[change]);

    function timeDuration (time: Date) {
        const duration = moment(time).fromNow();
        return duration;
    };
    

    return <div className='pantry__container'>
        <TableContainer
            elevation={5}
            sx={{
                height:'100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'flexStart',
                alignItems: 'flexStart',
            }}
            component={Paper}
        >
            <Table stickyHeader={true} aria-label='simple table'>
                <TableHead sx={{ height: '5%',marginBottom: '5%'}}>
                    <TableRow>
                        <TableCell>Add to Ingredients</TableCell>
                        <TableCell>PANTRY</TableCell>
                        <TableCell>BOUGHT</TableCell>
                        <TableCell>EXP. DATE</TableCell>
                        <TableCell align='right'>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { pantryList }
                </TableBody>
            </Table>
        </TableContainer>
    </div>
};

export default Pantry;