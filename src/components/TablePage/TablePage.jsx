import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import TableRow from '../TableRow/TableRow';
import Modal from '../Modal/Modal';
import './TablePage.css';

const TablePage = () => {
  const { tableId } = useParams();
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState({});

  const fetchRows = useCallback(async () => {
    try {
      const response = await api.get(`/tables/${tableId}/rows`);
      setRows(response.data);
    } catch (error) {
      toast.error('Failed to fetch rows');
    }
  }, [tableId]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleAddRow = async () => {
    try {
      await api.post(`/tables/${tableId}/rows`, newRowData);
      fetchRows();
      setIsModalOpen(false);
      setNewRowData({});
    } catch (error) {
      toast.error('Failed to add row');
    }
  };

  const handleDeleteRow = async (rowId) => {
    try {
      await api.delete(`/tables/${tableId}/rows/${rowId}`);
      fetchRows();
    } catch (error) {
      toast.error('Failed to delete row');
    }
  };

  return (
    <div>
      <h1>Table {tableId}</h1>
      <button onClick={() => setIsModalOpen(true)}>Add Row</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TableRow key={row.id} row={row} onDelete={handleDeleteRow} />
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Add New Row</h2>
        <input
          type="text"
          placeholder="Data"
          value={newRowData.data || ''}
          onChange={(e) => setNewRowData({ ...newRowData, data: e.target.value })}
        />
        <button onClick={handleAddRow}>Add</button>
      </Modal>
    </div>
  );
};

export default TablePage;