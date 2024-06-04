import React, { useState, useEffect, useContext } from "react";
import './Login.css';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Web3ApiContext } from '../../web3Context/apiContext';
import VerifyEmail  from "./VerifyEmail";

const BASE_URL = 'http://127.0.0.1:8003';
const AUTH_URL = 'http://127.0.0.1:8000';

export default function Register() {
   const [policeStation, setPoliceStation] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [selectedState, setSelectedState] = useState(null);
   const [selectedDistrict, setSelectedDistrict] = useState(null);
   const [states, setStates] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [open, setOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [validationErrors, setValidationErrors] = useState([]);
   const [validationOpen, setValidationOpen] = useState(false);
   const { connectWallet, connectedAccount } = useContext(Web3ApiContext);
   const [walletAddress, setWalletAddress] = useState(null);

   useEffect(() => {
      const fetchStates = async () => {
         try {
            const resp = await fetch(`${BASE_URL}/states`, { method: 'GET' });
            const data = await resp.json();
            console.log('Fetched states:', data);
            const formattedStates = data.map(state => ({
               label: state.name,
               code: state.code
            }));
            setStates(formattedStates);
         } catch (error) {
            console.error('Error fetching states:', error);
         }
      };
      fetchStates();
   }, []);

   useEffect(() => {
      if (selectedState) {
         const fetchDistricts = async () => {
            try {
               const resp = await fetch(`${BASE_URL}/states/${selectedState.code}/districts`, { method: 'GET' });
               const data = await resp.json();
               console.log('Fetched districts:', data);
               setDistricts(data.districts);
            } catch (error) {
               console.error('Error fetching districts:', error);
            }
         };
         fetchDistricts();
      }
   }, [selectedState]);

   const handleConnectWallet = async () => {
      await connectWallet();
      if (connectedAccount) {
         console.log(connectedAccount)
         setWalletAddress(connectedAccount);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!policeStation) {
         setErrorMessage('Police station name is required.');
         setValidationOpen(true);
         return;
      }

      if (password.length < 8) {
         setErrorMessage('Password must be at least 8 characters long.');
         setValidationOpen(true);
         return;
      }

      if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
         setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
         setValidationOpen(true);
         return;
      }

      if (!selectedState) {
         setErrorMessage('Please select a state.');
         setValidationOpen(true);
         return;
      }

      if (!selectedDistrict) {
         setErrorMessage('Please select a district.');
         setValidationOpen(true);
         return;
      }

      const payload = {
         name: policeStation,
         email,
         password,
         state: selectedState.label,
         district: selectedDistrict,
         wallet: walletAddress
      };

      try {
         const resp = await fetch(`${AUTH_URL}/police-station/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         if (resp.status === 409) {
            setErrorMessage('Police station already exists');
            setOpen(true);
         } else if (resp.status === 422) {
            const errorData = await resp.json();
            setValidationErrors(errorData.detail);
            setValidationOpen(true);
         } else if (resp.ok) {
            const data = await resp.json();
            console.log('Registration response:', data);

            // Store accessToken in localStorage
            if (typeof window !== "undefined") {
               localStorage.setItem('accessToken', data.accessToken);
            }

            // const otpResp = await fetch(`${AUTH_URL}/police-station/send-otp`, {
            //    method: 'GET',
            //    headers: {
            //       Authorization: `Bearer ${data.accessToken}`
            //    }
            // });

            // const otpData = await otpResp.text();
            // console.log('OTP response:', otpData);

            window.location.href = `/police-station/verify-email`;
         } else {
            const errorData = await resp.json();
            console.error('Registration error:', errorData);
         }
      } catch (error) {
         console.error('Error registering police station:', error);
      }
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleValidationClose = () => {
      setValidationOpen(false);
   };

   return (
      <>
         <h2 className="form_title2">Sign Up</h2>
         <div className="form_lodge2">
            <form onSubmit={handleSubmit}>
               <div className="input-container">
                  <h5 className="input-header">Police Station</h5>
                  <TextField
                     variant="outlined"
                     className="form_text_3"
                     type="text"
                     placeholder="Enter police station"
                     value={policeStation}
                     onChange={(e) => setPoliceStation(e.target.value)}
                  />
               </div>
               <div className="input-container">
                  <h5 className="input-header">E-mail id</h5>
                  <TextField
                     variant="outlined"
                     type="email"
                     className="form_text_3"
                     placeholder="Enter the mail id here"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div className="input-container">
                  <h5 className="input-header">Create Password</h5>
                  <TextField
                     variant="outlined"
                     className="form_text_3"
                     type="password"
                     placeholder="Create strong password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className="input-container">
                  <h5 className="input-header">State</h5>
                  <Autocomplete
                     disablePortal
                     id="state-select"
                     options={states}
                     getOptionLabel={(option) => option.label}
                     className="selection_box"
                     value={selectedState}
                     onChange={(e, newValue) => setSelectedState(newValue)}
                     renderInput={(params) => (
                        <TextField {...params} placeholder="Select a state" />
                     )}
                  />
               </div>

               <div className="input-container">
                  <h5 className="input-header">District</h5>
                  <Autocomplete
                     disablePortal
                     id="district-select"
                     options={districts}
                     getOptionLabel={(option) => option}
                     className="selection_box"
                     value={selectedDistrict}
                     onChange={(e, newValue) => setSelectedDistrict(newValue)}
                     renderInput={(params) => (
                        <TextField {...params} placeholder="Select a district" />
                     )}
                  />
               </div>
               <br />
               <div className="submit_div">
                  {walletAddress ? (
                     <button type="submit" className="submit_btn">
                        Register
                     </button>
                  ) : (
                     <button type="button" className="submit_btn" onClick={handleConnectWallet}>
                        Connect Wallet
                     </button>
                  )}
               </div>
            </form>
         </div>
         <div style={{ padding: '40px' }} />
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">{"Registration Error"}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {errorMessage}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Close
               </Button>
               <Button onClick={() => window.location.href = '/login'} color="primary" autoFocus>
                  Go to Login
               </Button>
            </DialogActions>
         </Dialog>
         <Dialog
            open={validationOpen}
            onClose={handleValidationClose}
            aria-labelledby="validation-error-dialog-title"
            aria-describedby="validation-error-dialog-description"
         >
            <DialogTitle id="validation-error-dialog-title">{"Validation Error"}</DialogTitle>
            <DialogContent>
               <DialogContentText id="validation-error-dialog-description">
                  {validationErrors.length > 0 ? validationErrors.map((error, index) => (
                     <div key={index}>
                        <strong>{error.loc.join(" -> ")}:</strong> {error.msg}
                     </div>
                  )) : errorMessage}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleValidationClose} color="primary">
                  Cancel
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
}
