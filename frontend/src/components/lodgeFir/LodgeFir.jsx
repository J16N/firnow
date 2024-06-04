import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Component,
} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useReactMediaRecorder } from "react-media-recorder";

import "./lodgeStyle.css";
import { Web3ApiContext } from "../../web3Context/apiContext";
import {
  FaVideo,
  FaMicrophone,
  FaVideoSlash,
  FaMicrophoneSlash,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LOCATION_URL = "http://127.0.0.1:8003";
const GENERAL_URL = "http://127.0.0.1:8001";

const LodgeFir = () => {
  const { connectedAccount, LodgeFIR } = useContext(Web3ApiContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [victimName, setVictimName] = useState(null);
  const [aadharNumber, setAadharNumber] = useState(0);
  const [accused, setAccused] = useState(null);
  const [description, setDescription] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationOpen, setValidationOpen] = useState(false);

  const [mystream, setmystream] = useState(null);
  const [videoswitch, setvideo] = useState(true);
  const [audioswitch, setaudio] = useState(true);
  const myvideo = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myvideo.current.srcObject = stream;
        myvideo.current.autoplay = true;
        myvideo.current.muted = false;
        setmystream(stream);
      });
  }, []);

  const handleVideo = () => {
    if (videoswitch) {
      setvideo(false);
      mystream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = false;
        }
      });
    } else {
      setvideo(true);
      mystream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = true;
        }
      });
    }
  };
  const handleAudio = () => {
    if (audioswitch) {
      setaudio(false);
      mystream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = false;
        }
      });
    } else {
      setaudio(true);
      mystream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = true;
        }
      });
    }
  };

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // NOT WORKING

  const handleUpload = async () => {
    console.log("Hello");

    try {
      if (!selectedFile) {
        throw new Error("No file selected");
      }

      const form = new FormData();
      form.append("file", selectedFile);
      console.log(selectedFile);

      const resp = await fetch(`${GENERAL_URL}/upload`, {
        method: "POST",
        body: form,
      });

      if (resp.ok) {
        console.log("File uploaded successfully");
        alert("File uploaded successfully");
        const jsonResponse = await resp.json();
        console.log(jsonResponse);
      } else {
        alert("Failed to upload file");
        console.error("Failed to upload file:", resp.statusText);
      }
    } catch (error) {
      alert("Error uploading file. Only pdf is allowed");
      console.error("Error uploading file:", error);
    }
  };

  const lodgeFir = async () => {
    await LodgeFIR();
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const resp = await fetch(`${LOCATION_URL}/states`, { method: "GET" });
        const data = await resp.json();
        if (Array.isArray(data)) {
          const formattedStates = data.map((state) => ({
            label: state.name,
            code: state.code,
          }));
          setStates(formattedStates);
        } else {
          console.error("Invalid data format for states:", data);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        try {
          const resp = await fetch(
            `${LOCATION_URL}/states/${selectedState.code}/districts`,
            { method: "GET" }
          );
          const data = await resp.json();
          if (data && Array.isArray(data.districts)) {
            setDistricts(
              data.districts.map((district) => ({ label: district }))
            );
          } else {
            console.error("Invalid data format for districts:", data);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedState]);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      if (selectedState && selectedDistrict) {
        try {
          const query = new URLSearchParams({
            state: selectedState.label,
            district: selectedDistrict.label,
          }).toString();
          const resp = await fetch(`${GENERAL_URL}/police-stations?${query}`, {
            method: "GET",
          });
          const data = await resp.json();
          if (Array.isArray(data) && data.length > 0) {
            setPoliceStations(data.map((station) => ({ label: station.name })));
          } else {
            console.log(
              "Could not find any police stations for the selected district. Fetching all police stations."
            );
            const allStationsResp = await fetch(
              `${GENERAL_URL}/police-stations`,
              { method: "GET" }
            );
            const allStationsData = await allStationsResp.json();
            if (Array.isArray(allStationsData)) {
              setPoliceStations(
                allStationsData.map((station) => ({ label: station.name }))
              );
            } else {
              console.error(
                "Invalid data format for all police stations:",
                allStationsData
              );
            }
          }
        } catch (error) {
          console.error("Error fetching police stations:", error);
        }
      }
    };
    fetchPoliceStations();
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    const fetchFirSubjects = async () => {
      try {
        const resp = await fetch(`${GENERAL_URL}/fir-subjects`, {
          method: "GET",
        });
        const data = await resp.json();
        if (Array.isArray(data)) {
          const formattedSubjects = data.map((subjects) => ({
            label: subjects.name,
            id: subjects.id,
          }));
          setSubjects(formattedSubjects);
        } else {
          console.error("Invalid data format for FIR subjects:", data);
        }
      } catch (error) {
        console.error("Error fetching FIR subjects:", error);
      }
    };
    fetchFirSubjects();
  }, []);

  const handleValidationClose = () => {
    setValidationOpen(false);
  };

  return (
    <>
      {/* <div className="cam">
        <button className="start" onClick={startRecording} autoPlay>
          Start Recording
        </button>
        <button className="stop" onClick={stopRecording}>
          Stop Recording
        </button>
        <video src={mediaBlobUrl} controls autoPlay loop />
      </div> */}
      <div className="cam" style={{ height: "300px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <video
            ref={myvideo}
            style={{
              width: "300px",
              height: "200px",
              transform: "scaleX(-1)",
            }}
          ></video>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          {/* <button
            onClick={handleVideo}
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#b8b1f9e6",
              color: "#4a097e",
              marginRight: "40px",
            }}
            title={videoswitch ? "Turn off video" : "Turn on video"}
          >
            {videoswitch ? (
              <FaVideo style={{ fontSize: "1.3rem" }} />
            ) : (
              <FaVideoSlash style={{ fontSize: "1.3rem" }} />
            )}
          </button> */}
          <button
            onClick={handleAudio}
            style={{
              marginLeft: "10px",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#4a097e",
              color: "#b8b1f9e6",
            }}
            title={audioswitch ? "Turn off audio" : "Turn on audio"}
          >
            {audioswitch ? (
              <FaMicrophone style={{ fontSize: "1.3rem" }} />
            ) : (
              <FaMicrophoneSlash style={{ fontSize: "1.3rem" }} />
            )}
          </button>
        </div>
      </div>
      <h2 className="form_title">Lodge FIR</h2>
      <div className="form_lodge_fir">
        <TextField
          variant="outlined"
          placeholder="Write your name"
          className="form_text"
          onChange={(e, newValue) => setVictimName(newValue)}
        />
        <br />
        <br />
        
        <Autocomplete
          disablePortal
          id="subject-select"
          options={subjects}
          className="selection_box"
          getOptionLabel={(option) => option.label}
          value={selectedSubject}
          onChange={(e, newValue) => setSelectedSubject(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select type of crime" />
          )}
        />
        <br />
        
        <TextField
          variant="outlined"
          type="number"
          placeholder="Write your Aadhar Number"
          className="form_text"
          onChange={(e, newValue) => setAadharNumber(newValue)}
        />
        <button style={{backgroundColor: 'rgb(75, 34, 96)', color: 'white', padding: '10px', fontWeight: 'bold', borderRadius: '5px',margin:'10px -140px', zIndex: '100', position: 'absolute'}}>Verify Aadhar</button>
        <br />
        <br />
        <TextField
          variant="outlined"
          placeholder="Write the name of accused one"
          className="form_text"
          onChange={(e, newValue) => setAccused(newValue)}
        />
        <br />
        <br />
        <TextField
          variant="standard"
          row={3}
          multiline={2}
          className="form_desc"
          placeholder="Write the description of crime"
          InputProps={{
            style: {
              padding: 10,
            },
            disableUnderline: true,
          }}
          onChange={(e, newValue) => setDescription(newValue)}
        ></TextField>
        <br />
        <br />
        <Autocomplete
          disablePortal
          id="state-select"
          options={states}
          className="selection_box"
          getOptionLabel={(option) => option.label}
          value={selectedState}
          onChange={(e, newValue) => setSelectedState(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select your State" />
          )}
        />
        <br />
        <Autocomplete
          disablePortal
          id="district-select"
          options={districts}
          className="selection_box"
          getOptionLabel={(option) => option.label}
          value={selectedDistrict}
          onChange={(e, newValue) => setSelectedDistrict(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select your District" />
          )}
        />
        <br />
        <Autocomplete
          disablePortal
          id="thana-select"
          options={policeStations}
          className="selection_box"
          getOptionLabel={(option) => option.label}
          value={selectedThana}
          onChange={(e, newValue) => setSelectedThana(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select your Thana" />
          )}
        />
        <br />
        <Container
          sx={{
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.75rem",
            fontFamily:
              "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            background: "rgb(255, 255, 255)",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "650px",
          }}
        >
          <Stack
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "12px",
              " @media(max-width:479px)": { padding: "16px 18px" },
            }}
            spacing="0px"
            direction="row"
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "20px",
                " @media(max-width:479px)": { fontSize: "18px" },
              }}
            >
              Attach proof file
            </Typography>
          </Stack>
          <Box sx={{ padding: "12px", width: "100%" }}>
            <Stack
              sx={{
                borderRadius: "0.375rem",
                border: "1px dashed rgb(204, 204, 204)",
                padding: "14px",
                width: "100%",
                alignItems: "center",
              }}
              spacing="20px"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB4PSIwIiB5PSIwIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGNpcmNsZSByPSIyNTYiIGN4PSIyNTYiIGN5PSIyNTYiIGZpbGw9IiNkY2RjZGMiIHNoYXBlPSJjaXJjbGUiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwwKSI+PC9jaXJjbGU+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC41MTk5OTk5OTk5OTk5OTk5LDAsMCwwLjUxOTk5OTk5OTk5OTk5OTksMTIyLjg4MDAwMDAwMDAwMDAyLDEyMi44ODAwMDAwMDAwMDAwMikiPjxwYXRoIGQ9Ik00NjcgMjExSDMwMVY0NWMwLTI0Ljg1My0yMC4xNDctNDUtNDUtNDVzLTQ1IDIwLjE0Ny00NSA0NXYxNjZINDVjLTI0Ljg1MyAwLTQ1IDIwLjE0Ny00NSA0NXMyMC4xNDcgNDUgNDUgNDVoMTY2djE2NmMwIDI0Ljg1MyAyMC4xNDcgNDUgNDUgNDVzNDUtMjAuMTQ3IDQ1LTQ1VjMwMWgxNjZjMjQuODUzIDAgNDUtMjAuMTQ3IDQ1LTQ1cy0yMC4xNDctNDUtNDUtNDV6IiBmaWxsPSIjOWY5ZjlmIiBvcGFjaXR5PSIxIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iIj48L3BhdGg+PC9nPjwvc3ZnPg=="
                width="35px"
                height="35px"
                alt=""
              />
              <Typography
                variant="p"
                sx={{ fontSize: "14px", fontWeight: "600" }}
              >
                Drop your PDF files here to attach them
              </Typography>
              <input type="file" onChange={handleFileUpload} />
              <Button
                variant="contained"
                type="submit"
                onClick={handleUpload}
                sx={{
                  backgroundColor: "#0d2036",
                  color: "rgb(255, 255, 255)",
                  fontSize: "14px",
                  fontWeight: "700",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px 12px",
                  textTransform: "none",
                }}
              >
                Upload
              </Button>
            </Stack>
          </Box>
        </Container>
        <div style={{ padding: "20px" }} />
        <div className="submit_div">
          <button onClick={() => lodgeFir()} className="submit_btn">
            Lodge FIR
          </button>
        </div>
      </div>
      <div style={{ padding: "40px" }} />
      <Dialog open={validationOpen} onClose={handleValidationClose}>
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleValidationClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LodgeFir;
