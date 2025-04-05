import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '@mui/material';

const AccountListPage = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/block/user/${id}?isBlocked=${!currentStatus}`);
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === id ? { ...account, isBlocked: !currentStatus } : account
        )
      );
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  return (
    <Container sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.fullName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.roleEnum}</TableCell>
                <TableCell>
                  <Switch
                    checked={!account.isBlocked}
                    onChange={() => handleToggle(account.id, account.isBlocked)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AccountListPage;
