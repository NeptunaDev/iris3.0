import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Controller } from '../controllersAdd/page';

interface BasicTableProps {
    data: Controller[];
    onDelete: (id: string) => void;
}

const BasicTable: React.FC<BasicTableProps> = ({ data, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">AP</TableCell>
                        <TableCell align="right">Site</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {row._id}
                            </TableCell>
                            <TableCell align="right">{row.ap}</TableCell>
                            <TableCell align="right">{row.site}</TableCell>
                            <TableCell align="right">
                                <Button sx = {{backgroundColor:"red !important", color: "white"}} variant="outlined" color="secondary" onClick={() => onDelete(row._id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default BasicTable;
