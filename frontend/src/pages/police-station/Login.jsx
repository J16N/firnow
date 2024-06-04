import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationOpen, setValidationOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = {
      username: email,
      password: password,
    };

    try {
      console.log("Hello");
      console.log(email);
      console.log(password);
      const resp = await fetch(
        `http://127.0.0.1:8000/police-station/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(formData).toString()
        }
      );

      if (resp.status === 401) {
        const errorData = await resp.json();
        setErrorMessage(errorData.message || "Invalid Credentials");
        setErrorOpen(true);
      } else if (resp.status === 422) {
        const errorData = await resp.json();
        setValidationMessage(errorData.message || "Validation error");
        console.log(errorData.message);
        setValidationOpen(true);
      } else if (resp.status === 404) {
        const errorData = await resp.json();
        setValidationMessage(errorData.message || "Account retrieval error");
        console.log(errorData.message);
        setValidationOpen(true);
      } else if (resp.ok) {
        const data = await resp.json();
        const accessToken = data.accessToken;
        console.log("login successful");
        console.log(accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
        }

        window.location.href = `/police-station/dashboard`;
      } else {
        
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleClose = () => {
    setErrorOpen(false);
  };

  const handleValidationClose = () => {
    setValidationOpen(false);
  };

  return (
    <>
      <h2 className="form_title2">Log in</h2>
      <div className="add-container">
        <div className="form_lodge2">
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <h5 className="input-header">Mail id</h5>
              <input
                className="input"
                type="email"
                placeholder="Enter the mail id here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-container">
              <h5 className="input-header">Password</h5>
              <input
                className="input"
                type="password"
                placeholder="Enter the password here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-container">
              <div className="submit_div" style={{ width: "60%" }}>
                <button type="submit" className="submit_btn">
                  Login
                </button>
              </div>
            </div>
          </form>
          <Link to="/police-station/register">
            <u>Register here</u>
          </Link>
        </div>
      </div>
      <div style={{ padding: "40px" }} />

      <Dialog
        open={errorOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Login Error"}</DialogTitle>
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
    </>
  );
}
