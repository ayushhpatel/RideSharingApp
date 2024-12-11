import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './NavigationBar';

function CreateRide() {
    const [pickupLocation, setPickupLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [Car, setCar] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [Contact, setContact] = useState('');
    const [AvailableSeats, setAvailableSeats] = useState(0);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [price, setPrice] = useState('');

    const id = localStorage.getItem('email');

    const handleCreateRide = async (e) => {
        e.preventDefault();

        const rideData = {
            action: "addRide",
            pickupLocation,
            destination,
            Car,
            licensePlate,
            AvailableSeats,
            Contact,
            driverId: id, 
            price,
        };

        try {
            const token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage
            const response = await axios.post(API_RIDES, rideData, { // Replace with your API Gateway URL
                headers: {
                    Authorization: `Bearer ${token}`, // Pass JWT in Authorization header
                    'Content-Type': 'application/json',
                },
            });
            // console.log('Ride added:', response);
            if (response.data.statusCode === 201) {
                setMessage('Ride added successfully!');
                clearForm();
            } else {
                setErrorMessage('Failed to add ride. Please try again.');
            }
        } catch (error) {
            console.error('Error adding ride:', error);
            setErrorMessage('Failed to add ride. Please try again.');
        }
    };

    const clearForm = () => {
        setPickupLocation('');
        setDestination('');
        setCar('');
        setLicensePlate('');
        setContact('');
        setAvailableSeats();
        setPrice('');
    };

    return (
        <>
        <NavigationBar/>
        <div className="container">
            <h2>Create a New Ride</h2>
            {message && <p className="text-success">{message}</p>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <form onSubmit={handleCreateRide}>
                <div className="form-group">
                    <label>Pickup Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Destination:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Car:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Car}
                        onChange={(e) => setCar(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Seat Capacity:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={AvailableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Driver Contact:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Ride</button>
            </form>
        </div>
        </>
    );
}

export default CreateRide;
