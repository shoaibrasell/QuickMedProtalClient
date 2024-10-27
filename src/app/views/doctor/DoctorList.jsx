import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import {Helmet} from "react-helmet";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { field: "DoctorName", headerName: "Doctor Title", width: 200 },
  { field: "Mobile", headerName: "Mobile", width: 150 },
  { field: "Address", headerName: "Address", width: 250 },
  { field: "TotalPrescriptionCount", headerName: "Total Prescription", width: 250 },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <IconButton
        color="primary"
        onClick={() => params.api.getCellValue(params.id, "showIdModal")()}
      >
        <VisibilityIcon />
      </IconButton>
    )
  }
];

export default function DoctorList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // Store selected doctor ID
  const [modalData, setModalData] = useState([]); // Prescription data for modal grid
  const [open, setOpen] = useState(false); // Control modal visibility

  // Fetch Doctor List on Component Mount
  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const response = await fetch("https://localhost:7202/api/Prescription/GetDoctorListData");
        const result = await response.json();

        if (result?.data) {
          setRows(result.data);
        } else {
          console.error("Invalid response format:", result);
        }
      } catch (error) {
        console.error("Error fetching doctor list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorList();
  }, []);

  // Handle Eye Icon Click to Fetch Prescription Data and Open Modal
  const handleViewClick = async (id) => {
    setSelectedId(id);

    try {
      const response = await fetch(
        `https://localhost:7202/api/Prescription/GetPrescriptionDataByDoctorId?doctorId=${id}`
      );
      const result = await response.json();

      if (result?.data) {
        setModalData(result.data);
      } else {
        console.error("Invalid response format:", result);
      }
    } catch (error) {
      console.error("Error fetching prescription data:", error);
    }

    setOpen(true); // Open the modal
  };

  // Close Modal
  const handleClose = () => {
    setOpen(false);
    setModalData([]); // Clear modal data on close
  };

  // Render Cell Actions with Eye Icon
  const renderCellActions = (params) => (
    <IconButton color="primary" onClick={() => handleViewClick(params.row.Id)}>
      <VisibilityIcon />
    </IconButton>
  );

  // Adjusted Columns to Use the Render Function
  const adjustedColumns = columns.map((col) =>
    col.field === "actions" ? { ...col, renderCell: renderCellActions } : col
  );

  // Modal Grid Columns for Prescription Data
  const modalColumns = [
    { field: "PrescriptionDate", headerName: "Date", width: 180 },
    { field: "Dx", headerName: "Diagnosis", width: 300 },
    { field: "PatientName", headerName: "Patient Name", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleModalActionClick(params.row)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  // Action handler for the modal DataGrid
  const handleModalActionClick = (row) => {
    alert(`Viewing prescription for ${row.PatientName}`);
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <h1>Doctor List</h1>
      <DataGrid
        rows={rows}
        columns={adjustedColumns}
        getRowId={(row) => row.Id}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 300 }
          }
        }}
        pageSizeOptions={[5, 10, 15]}
        disableRowSelectionOnClick
      />

      {/* Modal with DataGrid for Prescription Data */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "90%",
            transform: "translate(-90%, -50%)",
            width: "80%",
            maxWidth: "1200px",
            height: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: "auto"
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Prescription Data for Doctor ID: {selectedId}
          </Typography>

          {/* Modal DataGrid with Action Button */}
          <DataGrid
            rows={modalData}
            columns={modalColumns}
            getRowId={(row) => `${row.PatientName}-${row.PrescriptionDate}`}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />

          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
}
