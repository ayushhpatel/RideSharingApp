import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                // Retrieve email from localStorage
                const email = localStorage.getItem('email');
                if (!email) {
                    navigate('/signin'); // Redirect to signin if no email
                    return;
                }
            } catch (error) {
                console.error('Error fetching user type:', error);
                navigate('/signin'); // Redirect if an error occurs
            }
        };

        fetchUserType();
    }, [navigate]);

    const handleSignOut = () => {
        // Clear localStorage and redirect to signin
        localStorage.clear();
        navigate('/signin');
    };

    const userType=localStorage.getItem('userType');

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Ride Sharing App</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/available-rides">Available Rides</a>
                        </li>
                        {userType ==='Driver' && (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/create-ride">Create Ride</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/driver-rides">My Rides</a>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <button className="btn btn-danger nav-link" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;
