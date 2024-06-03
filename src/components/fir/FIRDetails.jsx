import React, { useState, useEffect } from "react";
//import axios from 'axios';
import { FaPlus } from "react-icons/fa";

import {
  sampleFIRDetail,
  sampleCaseStatusOptions,
  samplePoliceStations,
} from "./sampledata";

import "./firdetails.css";

const FIRDetails = ({ fir }) => {
  const {
    accusedNames,
    description,
    district,
    documentHash,
    firId,
    lodgedBy,
    state,
    status,
    subject,
    thanaAddress,
    timestamp,
    victimName,
  } = fir;
  /*
       //needed if axios used
      const [firDetail, setFIRDetail] = useState(null);
      const [caseStatusOptions, setCaseStatusOptions] = useState([]);
      const [policeStations, setPoliceStations] = useState([]);
    */
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("");
  const [firDetail, setFIRDetail] = useState(sampleFIRDetail);
  const [caseStatusOptions, setCaseStatusOptions] = useState(
    sampleCaseStatusOptions
  );
  const [policeStations, setPoliceStations] = useState(samplePoliceStations);

  const handleAddNote = () => {
    setShowNotePanel(true);
  };

  const handleSaveNote = () => {
    const updatedFIRDetail = { ...firDetail };
    updatedFIRDetail.notes.push(noteText);
    setFIRDetail(updatedFIRDetail);
    setShowNotePanel(false); // Hiding the note input panel
    setNoteText("");
  };

  // this feature not updating status in db rn
  const handleUpdateCaseStatus = () => {
    const updatedFIRDetail = { ...firDetail };
    updatedFIRDetail.status = selectedStatus;
    setFIRDetail(updatedFIRDetail);
  };

  const handleAssignToPoliceStation = () => {
    const updatedFIRDetail = { ...firDetail };
    updatedFIRDetail.assignedStation = selectedPoliceStation;
    setFIRDetail(updatedFIRDetail);
  };

  function convertTimestampToDate(ts) {
    return Date.prototype.toString.call(new Date(ts * 1000));
  }

  if (!firDetail) {
    return <div className="fir-detail-container">Loading FIR detail...</div>;
  }

  return (
    <div className="fir-detail-container">
      <h3 className="ffir-detail-title">FIR Details</h3>
      <p className="fir-detail-item-container">
        <strong>Case Number:</strong> {firId}
      </p>
      <p className="fir-detail-item-container">
        <strong>Date:</strong> {convertTimestampToDate(timestamp)}
      </p>
      <p className="fir-detail-item-container">
        <strong>Location:</strong> {firDetail.location}
      </p>
      <p className="fir-detail-item-container">
        <strong>Complainant:</strong> {victimName}
      </p>
      <p className="fir-detail-item-container">
        <strong>Description:</strong> {description}
      </p>
      <p className="fir-detail-item-container">
        <strong>Case Status:</strong>{" "}
        <span className="case-status">{status}</span>
      </p>
      <div>
        <h4>Attached Documents</h4>
        {firDetail.documents.map((document, index) => (
          <div key={index} className="fir-detail-item">
            <a href={document.url} target="_blank" rel="noopener noreferrer">
              {document.name}
            </a>
          </div>
        ))}
      </div>
      <div className="fir-detail-item-container">
        <button className="add-note-btn" onClick={handleAddNote}>
          <FaPlus /> Add Note
        </button>
      </div>
      {showNotePanel && (
        <div className="fir-detail-item-container">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter your note..."
          />
          <div>
            <button
              className="save-note-btn"
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {firDetail.notes.map((note, index) => (
        <div key={index} className="fir-detail-item-container">
          {note}
        </div>
      ))}

      <div className="status-container">
        <select
          className="select-box"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Select Case Status</option>
          {caseStatusOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="update-status-btn" onClick={handleUpdateCaseStatus}>
          Update Case Status
        </button>
      </div>
      <div className="status-container">
        <select
          className="select-box"
          value={selectedPoliceStation}
          onChange={(e) => setSelectedPoliceStation(e.target.value)}
        >
          <option value="">Select Police Station</option>
          {policeStations.map((station, index) => (
            <option key={index} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
        <button
          className="update-status-btn"
          onClick={handleAssignToPoliceStation}
        >
          Assign to Police Station
        </button>
      </div>
    </div>
  );
};

export default FIRDetails;
