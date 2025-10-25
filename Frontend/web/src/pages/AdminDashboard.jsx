// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { getUsers, registerTeacher } from '../services/api';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Typography, Alert } from '@mui/material';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: '', password: '', full_name: '', phone: '', school: '', subject_specialty: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await registerTeacher({ ...form, role: 'teacher' });
      setSuccess('Teacher registered!');
      setForm({ email: '', password: '', full_name: '', phone: '', school: '', subject_specialty: '' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Register New Teacher</Typography>
        <form onSubmit={handleRegister}>
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <TextField label="Full Name" fullWidth margin="normal" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
          <TextField label="Phone" fullWidth margin="normal" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <TextField label="School" fullWidth margin="normal" value={form.school} onChange={e => setForm({...form, school: e.target.value})} />
          <TextField label="Subject Specialty" fullWidth margin="normal" value={form.subject_specialty} onChange={e => setForm({...form, subject_specialty: e.target.value})} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register Teacher</Button>
        </form>
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>School</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.profile_name || user.student_name || '-'}</TableCell>
                <TableCell>{user.school || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}