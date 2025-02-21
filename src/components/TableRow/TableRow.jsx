import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import './TableRow.css';

const TableRow = () => {
  const { tableId, rowId } = useParams(); 
  const [rowData, setRowData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tableId || !rowId) {
      console.error('Ошибка: tableId или rowId не определены');
      toast.error('Invalid table or row ID');
      return;
    }

    const fetchRow = async () => {
      try {
        const response = await api.get(`/tables/${tableId}/rows/${rowId}`);
        setRowData(response.data);
      } catch (error) {
        toast.error('Failed to fetch row data');
        console.error('Error fetching row:', error);
      }
    };

    fetchRow();
  }, [tableId, rowId]);

  const handleEdit = async () => {
    try {
      await api.put(`/tables/${tableId}/rows/${rowId}`, rowData);
      toast.success('Row updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update row');
      console.error('Error updating row:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tables/${tableId}/rows/${rowId}`);
      toast.success('Row deleted successfully');
      navigate(`/tables/${tableId}/rows`); 
    } catch (error) {
      toast.error('Failed to delete row');
      console.error('Error deleting row:', error);
    }
  };

  const renderData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).map((key) => (
        <div key={key}>
          <strong>{key}:</strong>
          {renderData(data[key])}
        </div>
      ));
    }
    return <span>{data}</span>;
  };

  if (!rowData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>Row {rowId}</h1>
      {isEditing ? (
        <div>
          <textarea
            value={JSON.stringify(rowData.data, null, 2)}
            onChange={(e) => setRowData({ ...rowData, data: JSON.parse(e.target.value) })}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          {renderData(rowData.data)}
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TableRow;