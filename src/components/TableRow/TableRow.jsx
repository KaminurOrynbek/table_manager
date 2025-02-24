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
    if (!rowId) {
      toast.error("Row ID is undefined!");
      return;
    }

    const fetchRow = async () => {
      try {
        const response = await api.get(`/tables/${tableId}/rows/${rowId}`);
        let parsedData = response.data.data;
        try {
          parsedData = JSON.parse(response.data.data);
        } catch (error) {
          console.warn("Data is not in JSON format:", parsedData);
        }
        setRowData({ ...response.data, parsedData });
      } catch (error) {
        toast.error('Failed to fetch row data');
        console.error('Error fetching row:', error);
      }
    };

    fetchRow();
  }, [tableId, rowId]);

  const handleEdit = async () => {
    try {
      await api.put(`/tables/${tableId}/rows/${rowId}`, {
        ...rowData,
        data: JSON.stringify(rowData.parsedData),
      });
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
      navigate(`/tables/${tableId}`);
    } catch (error) {
      toast.error('Failed to delete row');
      console.error('Error deleting row:', error);
    }
  };

  if (!rowData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="table-row-container">
      <h1>Row {rowId}</h1>
      {isEditing ? (
        <div className="edit-container">
          <textarea
            className="edit-textarea"
            value={JSON.stringify(rowData.parsedData, null, 2)}
            onChange={(e) => {
              try {
                setRowData({ ...rowData, parsedData: JSON.parse(e.target.value) });
              } catch (error) {
                console.warn("Invalid JSON input");
              }
            }}
          />
          <div className="button-group">
            <button className="save-button" onClick={handleEdit}>Save</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="data-container">
          <pre className="json-display">{JSON.stringify(rowData.parsedData, null, 2)}</pre>
          <div className="button-group">
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRow;