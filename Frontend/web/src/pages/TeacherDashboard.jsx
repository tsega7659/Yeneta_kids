// src/pages/TeacherDashboard.jsx
import { useEffect, useState } from 'react';
import { getMyStudents } from '../services/api';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getMyStudents();
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Teacher Dashboard</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Stars</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.full_name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.age}</TableCell>
                <TableCell>{s.grade_level}</TableCell>
                <TableCell>{s.total_stars}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}