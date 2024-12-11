// src/Signin.js

import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';


const poolData = {
    UserPoolId: USER_POOL_ID, // Replace with your User Pool ID
    ClientId: CLIENT_ID       // Replace with your App Client ID
};
const userPool = new CognitoUserPool(poolData);

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const history = useHistory();
    const navigate = useNavigate();

    const handleSignin = (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: userPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                // Store the JWT in localStorage
                const jwtToken = result.getIdToken().getJwtToken();
                localStorage.setItem('jwt', jwtToken);
                localStorage.setItem('email', email);
                localStorage.setItem('userType',result.getIdToken().payload['cognito:groups']);

                console.log('Sign in successful! JWT stored.');

                // Redirect based on user type by checking Cognito groups
                redirectToUserPage(result);
            },
            onFailure: (err) => {
                setErrorMessage(err.message || JSON.stringify(err));
            }
        });
    };

    const redirectToUserPage = async (session) => {
        const userGroups = session.getIdToken().payload['cognito:groups'];
        
        if (userGroups && userGroups.includes('Driver')) {
            navigate('/driver-rides'); // Redirect to driver-specific page
        } else {
            navigate('/available-rides'); // Redirect to rider-specific page
        }
    };

    return (
        <div className="container">
            <h2>Sign In</h2>
            <form onSubmit={handleSignin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br/>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signin;