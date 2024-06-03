import React, { useContext } from "react";
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Pie } from 'react-chartjs-2';
import FIRDetails from "../components/fir/FIRDetails";
import { sampleFIRDetail, sampleCaseStatusOptions } from '../components/fir/sampledata';

import "./dashboard.css";
import { Web3ApiContext } from "../web3Context/apiContext";

const PieChart = ({ smallScreen }) => {
    const data = {
        labels: ['Registered', 'Under Investigation', 'Disposed', 'Forwarded to the Court', 'Pending'],
        datasets: [
            {
                data: [300, 50, 100, 150, 200], // Sample data ; can't able to fetch them from sample data will try later
                backgroundColor: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'], 
            },
        ],
    };

    const options = {
        maintainAspectRatio: !smallScreen, // Set to true for larger screens, false for smaller screens
        plugins: {
            title: {
                display: true,
                text: 'Chart Title',
                fontSize: smallScreen ? 16 : 20, 
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontSize: smallScreen ? 12 : 14, 
                },
            },
        },
    };
    return <div>
        <Pie data={data} width={600} height={400} options={options} />
    </div>;
};

const Dashboard = () => {
    const [firs, setFIRs] = useState([]);
    const [filteredFIRs, setFilteredFIRs] = useState([]);
    const [smallScreen, setSmallScreen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState('');
    const {getFIRbyThana} = useContext(Web3ApiContext);

    useEffect(() => {
        getFIRbyThana().then((data) => {
            setFIRs(data);
        }).then(() => {
            console.log(firs)
        })
        // setFIRs([sampleFIRDetail]);     // Fetching FIRs using sample data for now
        setFilteredFIRs([sampleFIRDetail]);
    }, []);

    useEffect(() => {
        if (filterCriteria) {
            const filtered = firs.filter(fir => fir.status === filterCriteria);
            setFilteredFIRs(filtered);
        } else {
            setFilteredFIRs(firs);
        }
    }, [filterCriteria, firs]);

    const handleFilterChange = (e) => {
        setFilterCriteria(e.target.value);
    };

    useEffect(() => {
        const handleResize = () => {
            setSmallScreen(window.innerWidth < 768); // breakpoint ; priyanka change it if needed
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="dash">
            <h2 className="form_title1">Police Dashboard</h2>
            <div className="scroll-container padded-filter" >
                <select className="select-box" value={filterCriteria} onChange={handleFilterChange}>
                    <option value="">All</option>
                    {sampleCaseStatusOptions.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="scroll-container">
                <Scrollbars style={{ margin:'auto' ,width: '50%', minHeight: '600px' }}>
                    <div className="form_lodge">
                        <PieChart smallScreen={smallScreen} />
                    </div>
                </Scrollbars>
            </div>
            <div className="scroll-container">
                <Scrollbars style={{ width: '100%', minHeight: '1000px' }}>
                    <div>
                        {firs.length > 0 ? (
                            firs.map(fir => {
                                return (
                                <FIRDetails fir={fir} />
                            )
                            })
                        ) : (
                            <p>No FIRs found for the selected status.</p>
                        )}
                    </div>
                </Scrollbars>
            </div>
        </div>
    );
};

export default Dashboard;
