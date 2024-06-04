const sampleFIRDetail = {
    caseNumber: "FIR123456",
    date: "2024-05-10",
    location: "Sample Location",
    complainant: "John Doe",
    description: "Sample description of the FIR",
    status: "Registered", 
    documents: [
        { name: "Document 1", url: "https://example.com/document1.pdf" },
        { name: "Document 2", url: "https://example.com/document2.pdf" },
    ],
    notes: [
        "Note 1",
        "Note 2",
    ],
    assignedStation: "1" // Initial assigned police station
};

const sampleCaseStatusOptions = ["Registered", "Under Investigation", "Disposed", "Forwarded to the Court", "Pending"];

const samplePoliceStations = [
    { id: "1", name: "Station A" },
    { id: "2", name: "Station B" },
    { id: "3", name: "Station C" },
];

export { sampleFIRDetail, sampleCaseStatusOptions, samplePoliceStations };
