import React, { useState, useEffect } from "react";
import './Login.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationOpen, setValidationOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    useEffect(() => {
       // const accessToken = getQueryParam('accessToken');
       const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
    }, []);

    const handleVerifyEmail = async () => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const resp = await fetch(
                `http://127.0.0.1:8000/police-station/verify-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ otp })
                }
            );

            if (resp.status === 400) {
                const errorData = await resp.json();
                setErrorMessage(errorData.message || 'Invalid OTP');
                setErrorOpen(true);
            } else if (resp.status === 422) {
                const errorData = await resp.json();
                setValidationMessage(errorData.message || 'Validation error');
                setValidationOpen(true);
            } else if (resp.ok) {
                const data = await resp.json();
                console.log("otp verified ", data);
                setMessage(data.message);
                window.location.href = `/police-station/dashboard`;
            }
        } catch (error) {
            console.error('Error verifying email:', error);
        }
    };

    const handleClose = () => {
        setErrorOpen(false);
    };

    const handleValidationClose = () => {
        setValidationOpen(false);
    };

    return (
        <div className="add-container">
            <div className="details-container form_lodge2">
                <h2 className="form_title2">Verify Email</h2>
                <div className="input-container">
                    <h5 className="input-header">OTP</h5>
                    <input
                        type="text"
                        className="input form_text_3"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
                <div className="submit_div">
                    <button type="button" className="submit_btn" onClick={handleVerifyEmail}>
                        Verify Email
                    </button>
                </div>
                {message && <p>{message}</p>}
            </div>

            <Dialog
                open={errorOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Verification Error"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={validationOpen}
                onClose={handleValidationClose}
                aria-labelledby="validation-dialog-title"
                aria-describedby="validation-dialog-description"
            >
                <DialogTitle id="validation-dialog-title">{"Validation Error"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="validation-dialog-description">
                        {validationMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleValidationClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default VerifyEmail;
