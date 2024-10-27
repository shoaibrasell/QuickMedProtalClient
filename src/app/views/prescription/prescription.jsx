import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

const handleViewClick = (row) => {
  alert(`Viewing record: ${JSON.stringify(row, null, 2)}`);
};

var rows = [];
const columns = [
  { field: "DoctorName", headerName: "Doctor Title", width: 200 },
  { field: "Mobile", headerName: "Mobile", width: 150 }, // Ensure case matches API response
  { field: "Address", headerName: "Address", width: 250 },
  //   { field: "CreatedAt", headerName: "Created At", width: 180, type: "dateTime" },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <IconButton color="primary" onClick={() => handleViewClick(params.row)}>
        <VisibilityIcon />
      </IconButton>
    )
  }
];

export default function prescription() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7202/api/Prescription/GetPrescriptionDataByDoctorId?doctorId=${DoctorId}`
        );
        const result = await response.json();
        console.log(result); // Log response to ensure correctness

        // Check if the data is present and set it to the state
        if (result?.data) {
          rows = result.data;
          //setRows(result.data); // Set the fetched data as rows
        } else {
          console.error("Invalid response format:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <h1>Prescription List</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.Id} // Use "Id" as the unique row identifier
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
    </Box>
  );
}
