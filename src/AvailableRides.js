import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './NavigationBar';

function AvailableRides() {
    const [rides, setRides] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [searchPickup, setSearchPickup] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const riderId = localStorage.getItem("email");


    // Fetch all available rides on page load
    useEffect(() => {
        fetchRides();
    }, []);


    const fetchRides = async () => {
        try {
            const token = localStorage.getItem('jwt'); // Retrieve the JWT for authentication
            const response = await axios.get(API_RIDES, { // Replace with your API Gateway URL
                headers: {
                    Authorization: `Bearer ${token}`, // Pass JWT in Authorization header
                },
            });
            console.log(response.data.body);
            let rides = response.data.body;
            if (typeof rides === 'string') {
                rides = JSON.parse(rides); // Parse the string into a JSON array
            }
            // Filter rides with AvailableSeats > 0
            const availableRides = rides.filter((ride) => ride.AvailableSeats > 0);
            setRides(availableRides);
            setFilteredRides(availableRides); // Initialize filtered rides
        } catch (error) {
            console.error('Error fetching rides:', error);
            setErrorMessage('Failed to fetch rides. Please try again later.');
        }
    };

    // Handle search for pickup location and destination
    const handleSearch = () => {
        const results = rides.filter(
            (ride) =>
                ride.PickupLocation.toLowerCase().includes(searchPickup.toLowerCase()) &&
                ride.Destination.toLowerCase().includes(searchDestination.toLowerCase())
        );
        setFilteredRides(results);
    };

    // Handle booking a ride
    const handleBookRide = async (rideId) => {
        try {
            const token = localStorage.getItem('jwt'); // Retrieve the JWT for authentication
            await axios.post(
                API_RIDES, // Replace with your API Gateway URL
                {
                    action: 'bookRide', // Specify the action for booking
                    rideId, // Pass the ride ID
                    riderId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Re-fetch rides to update the list
            fetchRides();
        } catch (error) {
            console.error('Error booking ride:', error);
            setErrorMessage('Failed to book ride. Please try again.');
        }
    };

    return (
        <>
        <NavigationBar />
        <div className="container">
            <h2>Available Rides</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Search Form */}
            <div className="form-row mb-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Pickup Location"
                        value={searchPickup}
                        onChange={(e) => setSearchPickup(e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Destination"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* List of Rides */}
            <div className="container">
    <div className="row">
        {filteredRides.map((ride) => (
            <div key={ride.RideId} className="col-12 col-lg-6 mb-4">
                <div className="border rounded p-3 h-100 d-flex flex-column">
                    <div className="row">
                        <div className="col-6">
                            <p><strong>Pickup:</strong> {ride.PickupLocation}</p>
                            <p><strong>Car:</strong> {ride.Car}</p>
                            <p><strong>Seats Available:</strong> {ride.AvailableSeats}</p>
                        </div>
                        <div className="col-6">
                            <p><strong>Destination:</strong> {ride.Destination}</p>
                            <p><strong>Price:</strong> ${ride.Price}</p>
                            <p><strong>Contact Number:</strong> {ride.Contact}</p>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            className="btn btn-success w-100"
                            onClick={() => handleBookRide(ride.RideId)}
                        >
                            Book
                        </button>
                    </div>
                </div>
            </div>
        ))}
        {filteredRides.length === 0 && (
            <p className="text-center w-100">No rides found for the specified criteria.</p>
        )}
    </div>
</div>




        </div>
        </>
    );
}

export default AvailableRides;
