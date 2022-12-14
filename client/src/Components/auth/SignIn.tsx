import { Alert, Button, Card, CardHeader, FormControl, TextField } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import '../../Styles/SignIn.css';
import { setUid } from "../userTokenManager";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNotUser, setIsNotUser] = useState(false);

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            setUid(userCredentials.user.uid);
            setIsNotUser(false);
            navigate('/');
        })
        .catch((err) => {
            setIsNotUser(true);
            console.log(err);
        })
    }

    return (
        <div className="sign__in__container">
            <Card raised={true} className='sign__in__form'>
                <CardHeader title='Log in'/>
                {
                    (isNotUser) ? (
                        <Alert variant='outlined' severity="error">Incorrect email or password!</Alert>
                    ) : (<p> </p>)
                }
                <FormControl>
                    <TextField
                        variant="filled"
                        type='text'
                        label='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></TextField>
                    <TextField 
                        variant="filled"
                        type='password'
                        label='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></TextField>
                    <Button style={{marginTop: '3%', marginBottom: '3%'}} variant='contained' type="submit" onClick={signIn} >Log in</Button>
                </FormControl>
                <p>Don't have an account?</p>
                <Button onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup');
                    }
                }>Sign Up</Button>
            </Card>
        </div>
    )
}

export default SignIn;