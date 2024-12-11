import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import NavigationBar from "./NavigationBar";

function DriverRides() {
    const [rides, setRides] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch driver rides and their bookings on page load
    useEffect(() => {
        fetchDriverRides();
    }, []);

    const fetchDriverRides = async () => {
        try {
            const token = localStorage.getItem("jwt"); // Retrieve JWT from localStorage
            const driverId = localStorage.getItem("email"); // Retrieve driver's email from localStorage

            if (!driverId) {
                setErrorMessage("Driver not logged in. Please log in to view your rides.");
                return;
            }

            const response = await axios.post(
                API_RIDES,
                {
                    action: "getDriverRidesWithBookings",
                    driverId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // console.log(response.data.body)
            let rides = response.data.body;
            if (typeof rides === 'string') {
                rides = JSON.parse(rides); // Parse the string into a JSON array
            }
            setRides(rides); // Set rides with bookings
        } catch (error) {
            console.error("Error fetching driver rides:", error);
            setErrorMessage("Failed to fetch your rides. Please try again later.");
        }
    };

    return (
        <>
        <NavigationBar />
        <div className="container mt-4">
            <h2>Your Rides and Bookings</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {rides.length > 0 ? (
                rides.map((ride) => (
                    <div key={ride.RideId} className="card mb-3">
                        <div className="card-body">
                            {/* <h5 className="card-title">Ride ID: {ride.RideId}</h5> */}
                            <p><strong>Pickup Location:</strong> {ride.PickupLocation}</p>
                            <p><strong>Destination:</strong> {ride.Destination}</p>
                            <p><strong>Seats Available:</strong> {ride.AvailableSeats}</p>

                            <h6>Bookings: {ride.Bookings.length > 0 ? ride.Bookings.length:0}</h6>
                            {ride.Bookings && ride.Bookings.length > 0 ? (
                                <ul className="list-group">
                                    {ride.Bookings.map((booking) => (
                                        <li key={booking.RequestId} className="list-group-item">
                                            <p><strong>Rider Email:</strong> {booking.RiderId}</p>
                                            {/* <p><strong>Status:</strong> {booking.Status}</p> */}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings for this ride yet.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                !errorMessage && <p>You have not created any rides yet.</p>
            )}
        </div>
        </>
    );
}

export default DriverRides;
