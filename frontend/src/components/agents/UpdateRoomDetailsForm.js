import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, TextField, Button, Box, FormControlLabel, Checkbox, Grid, CircularProgress, Typography
} from '@mui/material';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import roomImage from './vacation.png';
import { GET_ROOM_DETAILS, UPDATE_ROOM_DETAILS } from '../../constants/constants.js';
import { getSession } from '../../lib/session.js';
import ChatComponent from '../ChatComponent.js';

const UpdateRoomDetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomDetails } = location.state || {};
    const token = getSession();

    const [formData, setFormData] = useState({
        roomId: '', // Initialize roomId
        roomName: '',
        roomAddress: '',
        roomType: '',
        roomNumber: '',
        price: '',
        amenities: [],
        roomDescription: '',
        base64Image: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUploadStatus, setImageUploadStatus] = useState('');
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        if (roomDetails) {
            setFormData({
                ...roomDetails,
                roomId: roomDetails.roomId || '', // Ensure roomId is included
                base64Image: roomDetails.base64Image || '',
            });
            setLoading(false);
        } else {
            const roomId = location.pathname.split("/").pop();
            fetch(GET_ROOM_DETAILS)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setFormData({
                        ...data,
                        roomId: data.roomId || '', // Ensure roomId is included
                        base64Image: data.base64Image || '',
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching room details:', error);
                    setError('Failed to fetch room details.');
                    setLoading(false);
                });
        }
    }, [roomDetails, location.pathname]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                amenities: checked
                    ? [...prevData.amenities, value]
                    : prevData.amenities.filter(amenity => amenity !== value),
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Extract base64 part of the image
            setFormData(prevData => ({
                ...prevData,
                base64Image: base64String,
            }));
            setImageUploadStatus('Image uploaded successfully');
            setImageUploading(false);
        };
        reader.readAsDataURL(file);
        setImageUploading(true);
        setImageUploadStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        if (!formData.roomId) {
            console.error('Room ID is missing in formData:', formData);
            setError('Room ID is missing.');
            return;
        }

        try {
            const payload = {
                roomId: formData.roomId,
                roomName: formData.roomName,
                roomAddress: formData.roomAddress,
                roomType: formData.roomType,
                roomNumber: formData.roomNumber,
                price: formData.price,
                amenities: formData.amenities,
                roomDescription: formData.roomDescription,
                base64Image: formData.base64Image
            };

            console.log('Payload:', payload);

            const response = await fetch(UPDATE_ROOM_DETAILS, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response Data:', errorData);
                throw new Error(errorData.message || 'Error updating room details');
            }

            const data = await response.json();
            console.log('Response Data:', data);

            alert(data.message);
            navigate('/agent/dashboard');
        } catch (error) {
            setError(error.message);
            console.error('Error submitting form:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Header color="black" />
            <Container>
                <div className="flex justify-between items-center border-b border-indigo-200 pb-6 pt-24">
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#471AA0]">
                        Update Room Details
                    </h1>
                </div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Room Name"
                                    name="roomName"
                                    value={formData.roomName}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Room Address"
                                    name="roomAddress"
                                    value={formData.roomAddress}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Room Type"
                                    name="roomType"
                                    value={formData.roomType}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Room Number"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Room Description"
                                    name="roomDescription"
                                    value={formData.roomDescription}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Price per night"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.amenities.includes('Free Wi-Fi')} onChange={handleChange} value="Free Wi-Fi" />}
                                    label="Free Wi-Fi"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.amenities.includes('Air Conditioning')} onChange={handleChange} value="Air Conditioning" />}
                                    label="Air Conditioning"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.amenities.includes('Flat Screen TV')} onChange={handleChange} value="Flat Screen TV" />}
                                    label="Flat Screen TV"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.amenities.includes('Mini Bar')} onChange={handleChange} value="Mini Bar" />}
                                    label="Mini Bar"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.amenities.includes('Room Service')} onChange={handleChange} value="Room Service" />}
                                    label="Room Service"
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    margin="normal"
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                                {imageUploading && <CircularProgress />}
                                {imageUploadStatus && <Typography>{imageUploadStatus}</Typography>}
                                <Box textAlign="center" mt={3}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Update Room
                                    </Button>
                                </Box>
                            </form>
                            {error && (
                                <Box mt={2}>
                                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                                </Box>
                            )}
                        </Container>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src={roomImage} alt="Room Image" style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            <ChatComponent />
        </>
    );
};

export default UpdateRoomDetailsForm;
