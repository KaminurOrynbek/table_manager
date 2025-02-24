import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import Modal from '../Modal/Modal';
import './TablePage.css';

const TablePage = () => {
  const { tableId } = useParams();
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [rowData, setRowData] = useState({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowData, setNewRowData] = useState('{}');

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

  const handleEditRow = (row) => {
    setEditingRow(row);
    setRowData(JSON.stringify(row.data, null, 2));
    setIsModalOpen(true);
    setIsAddingRow(false);
  };

  const handleSaveRow = async () => {
    if (!editingRow) return;

    let parsedData;
    try {
      parsedData = JSON.parse(rowData);
    } catch (error) {
      toast.warning('Invalid JSON format');
      return;
    }

    try {
      await api.put(`/tables/${tableId}/rows/${editingRow.id}`, { data: parsedData });
      toast.success('Row updated successfully');
      fetchRows();
      setIsModalOpen(false);
      setEditingRow(null);
    } catch (error) {
      toast.error('Failed to update row');
    }
  };

  const handleDeleteRow = async (rowId) => {
    try {
      await api.delete(`/tables/${tableId}/rows/${rowId}`);
      toast.success('Row deleted');
      fetchRows();
    } catch (error) {
      toast.error('Failed to delete row');
    }
  };

  const handleAddRow = async () => {
    let parsedData;
    try {
      parsedData = JSON.parse(newRowData);
    } catch (error) {
      toast.warning('Invalid JSON format');
      return;
    }

    try {
      await api.post(`/tables/${tableId}/rows`, { data: parsedData });
      toast.success('Row added successfully');
      fetchRows();
      setIsModalOpen(false);
      setNewRowData('{}'); // Reset input
    } catch (error) {
      toast.error('Failed to add row');
    }
  };

  return (
    <div className="table-container">
      <h1>Table {tableId}</h1>
      
      <button onClick={() => { setIsAddingRow(true); setIsModalOpen(true); }}>Add Row</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            let rowData;
            try {
              rowData = JSON.parse(row.data);
            } catch (error) {
              rowData = row.data;
            }

            return (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{JSON.stringify(rowData)}</td>
                <td>
                  <button onClick={() => handleEditRow(row)}>Edit</button>
                  <button onClick={() => handleDeleteRow(row.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{isAddingRow ? "Add Row" : "Edit Row"}</h2>
        <textarea
          value={isAddingRow ? newRowData : rowData}
          onChange={(e) => isAddingRow ? setNewRowData(e.target.value) : setRowData(e.target.value)}
          style={{ width: "346px", height: "285px" }}
        />
        <button onClick={isAddingRow ? handleAddRow : handleSaveRow}>
          {isAddingRow ? "Add Row" : "Save"}
        </button>
      </Modal>
    </div>
  );
};

export default TablePage;
