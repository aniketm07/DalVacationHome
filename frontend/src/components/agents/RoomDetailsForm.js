import React, { useState } from 'react';
import {
    Container, TextField, Button, Box, FormControlLabel, Checkbox, Grid, CircularProgress, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import roomImage from './vacation.png';
import { ADD_ROOM } from '../../constants/constants';
import { getSession } from '../../lib/session';
import ChatComponent from '../ChatComponent';

const RoomDetailsForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomName: '',
        roomAddress: '',
        roomType: '',
        roomNumber: '',
        price: '',
        amenities: [],
        roomDescription: '',
        base64Image: '',
    });

    const [imageUploadStatus, setImageUploadStatus] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const token = getSession();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                amenities: checked
                    ? [...formData.amenities, value]
                    : formData.amenities.filter((amenity) => amenity !== value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Extract base64 part of the image
            setFormData({ ...formData, base64Image: base64String });
            setImageUploadStatus('Image uploaded successfully');
            setImageUploading(false);
            console.log('Base64 Image:', base64String); // Print base64 image data
        };
        reader.readAsDataURL(file);
        setImageUploading(true);
        setImageUploadStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); // Print form data before sending

        try {
            const response = await fetch(ADD_ROOM, { // Use constant for API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Response Data:', data); // Print response data from API

            if (response.ok) {
                alert(data.message);
                navigate('/agent/dashboard'); // Adjust the path as per routing configuration
            } else {
                alert('Error submitting form: ' + data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error); // Print error if any
            alert('Error submitting form');
        }
    };

    return (
        <>
            <Header color="black" />
            <Container>
                <div className="flex justify-between items-center border-b border-indigo-200 pb-6 pt-24">
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#471AA0]">
                        Add Room
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
                                        Submit
                                    </Button>
                                </Box>
                            </form>
                        </Container>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src={roomImage} alt="Room Image" style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                </Grid>
            </Container>
            <ChatComponent />
            <Footer />
        </>
    );
};

export default RoomDetailsForm;
