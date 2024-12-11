import React, { useState } from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';

const poolData = {
    UserPoolId: USER_POOL_ID, // Replace with your User Pool ID
    ClientId: CLIENT_ID // Replace with your App Client ID
};
const userPool = new CognitoUserPool(poolData);

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Rider');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState(''); // For success messages

    const navigate = useNavigate();
    let cognitoUser = null; // Store CognitoUser instance for later use

    const handleSignup = async (e) => {
        e.preventDefault();

        const attributeList = [
            new CognitoUserAttribute({ Name: 'email', Value: email })
        ];

        // Register user in Cognito
        userPool.signUp(email, password, attributeList, null, async (err, result) => {
            if (err) {
                setErrorMessage(err.message || JSON.stringify(err));
                return;
            }

            cognitoUser = result.user;
            const userSub = result.userSub;
            console.log('User registered with sub:', userSub);

            // Store email in localStorage
            localStorage.setItem('email', email);

            // Prepare group parameters
            const groupParams = {
                GroupName: userType, // 'Rider' or 'Driver'
                Username: userSub,   // Use the userSub (unique ID) as Username
                UserPoolId: poolData.UserPoolId
            };

            // console.log("Group Parameters:", groupParams);

            // Call API to assign user to group
            await assignUserToGroup(groupParams);
            setMessage("Sign up successful! A verification code has been sent to your email.");
            // Trigger verification flow
            setIsVerifying(true);
        });
    };

    const assignUserToGroup = async (groupParams) => {
        const apiEndpoint = API_ADD_USER_TO_GROUP; // API Gateway URL

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupParams)
            });

            const data = await response.json();
            console.log("Lambda Response:", data);

            // console.log('User successfully added to group');
        } catch (error) {
            setErrorMessage('Error connecting to API: ' + error.message);
            console.error('API error:', error);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();

        if (!cognitoUser) {
            cognitoUser = new CognitoUser({
                Username: email,
                Pool: userPool
            });
        }

        cognitoUser.confirmRegistration(verificationCode, true, async (err, result) => {
            if (err) {
                setErrorMessage(err.message || JSON.stringify(err));
                return;
            }

            console.log('User confirmed successfully:', result);
            setMessage("Verification successful! Redirecting to the sign-in page...");
            navigate('/signin');
        });
    };

    return (
        <div className="container">
            {!isVerifying ? (
                <>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignup}>
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
                        <div className="form-group">
                            <label>User Type:</label>
                            <select
                                className="form-control"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <option value="Rider">Rider</option>
                                <option value="Driver">Driver</option>
                            </select>
                        </div>
                        <br/>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </>
            ) : (
                <>
                    <h2>Verify Email</h2>
                    <form onSubmit={handleVerification}>
                        <div className="form-group">
                            <label>Verification Code:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <br/>
                        {/* {errorMessage && <p className="text-danger">{errorMessage}</p>} */}
                        {message && <p className="text-success">{message}</p>}
                        <button type="submit" className="btn btn-primary">Verify</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Signup;
