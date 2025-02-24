import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import './MainPage.css';

const MainPage = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data || []); 
    } catch (error) {
      toast.error('Failed to fetch tables');
      setTables([]); 
    }
  };
  

  const handleCreateTable = async () => {
    try {
      await api.post('/tables', { name: newTableName });
      fetchTables();
      setNewTableName('');
    } catch (error) {
      toast.error('Failed to create table');
    }
  };

  return (
    <div>
      <h1>Your Tables</h1>
      <input
        type="text"
        placeholder="New Table Name"
        value={newTableName}
        onChange={(e) => setNewTableName(e.target.value)}
      />
      <button onClick={handleCreateTable}>Create Table</button>
      <ul>
        {tables.map((table) => (
          <li key={table.id} onClick={() => navigate(`/tables/${table.id}/rows`)}>
            {table.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;