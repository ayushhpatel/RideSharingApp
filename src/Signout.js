import React from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';


const poolData = {
    UserPoolId: USER_POOL_ID, // Replace with your User Pool ID
    ClientId: CLIENT_ID        // Replace with your App Client ID
};
const userPool = new CognitoUserPool(poolData);

function Signout() {
    const navigate = useNavigate();

    const handleSignout = () => {
        const user = userPool.getCurrentUser();
        if (user) {
            user.signOut();
            // console.log('User signed out from Cognito.');
        }

        // Clear JWT from localStorage
        localStorage.removeItem('jwt');
        localStorage.removeItem('email');
        // console.log('JWT removed from localStorage.');

        // Redirect to signin page
        alert('You have been signed out.');
        navigate('/signin');
    };

    return (
        <div className="container">
            <button className="btn btn-secondary mt-3" onClick={handleSignout}>
                Sign Out
            </button>
        </div>
    );
}

export default Signout;
