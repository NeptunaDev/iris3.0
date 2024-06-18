import React from 'react'
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const page = () => {
  const data = [
    { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
    { name: 'Jane Smith', age: 34, email: 'jane.smith@example.com' },
    { name: 'Mike Johnson', age: 45, email: 'mike.johnson@example.com' },
  ];
  
  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'Email', key: 'email' },
  ];

  return (
        <Container sx={{ backgroundColor: "#fff", borderRadius: "20px" }}>
          <Typography variant="h1" gutterBottom>
            Datos de Usuarios
          </Typography>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
              Descargar CSV
            </Button>
          <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container> 
  )
}

export default page;