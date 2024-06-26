import React, { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { clearTable, removeTable } from '../utils/api';
import './TablesDisplay.css';

function TablesDisplay({ tables, loadDashboard }) {
  const [finishError, setFinishError] = useState(null);

  async function handleFinish(tableId) {
    if (
      window.confirm(
        'Is this table ready to seat new guests?'
      )
    ) {
      const abortController = new AbortController();
      setFinishError(null);
      try {
        await clearTable(tableId);
        loadDashboard();
      } catch (error) {
        setFinishError(error);
      }

      return () => abortController.abort();
    }
  }

  async function handleRemove(tableId) {
    if (
      window.confirm(
        'Are you sure you want to remove this table?'
      )
    ) {
      const abortController = new AbortController();
      setFinishError(null);
      try {
        await removeTable(tableId);
        loadDashboard();
      } catch (error) {
        setFinishError(error);
      }

      return () => abortController.abort();
    }
  }

  const content = tables.map((table, index) => (
    <div className="table tabledisplay" key={table.table_id}>
      <div className="card-header">{table.table_name}</div>
      <ul className="list-group">
        <li className="list-group-item">Capacity: {table.capacity}</li>
        <li
          className="list-group-item"
          data-table-id-status={`${table.table_id}`}
        >
          Status: {table.reservation_id ? "Occupied" : "Free"}
        </li>
        
          {(table.reservation_id && (
            <button
              type="button"
              className="btn btn-danger table-btn"
              data-table-id-finish={`${table.table_id}`}
              onClick={() => handleFinish(table.table_id, table.reservation_id)}
            >
              Finish
            </button>
          )) || (
            <button
              type="button"
              className="btn btn-warning table-btn"
              data-table-id-remove={`${table.table_id}`}
              onClick={() => handleRemove(table.table_id)}
            >Remove</button>
          )}
                    
      </ul>
    </div>
  ));

  return (
    <main>
      <div className="error-alert">
        <ErrorAlert error={finishError} />
      </div>
      {tables.length !== 0 && (
        <>
          <div className="tables-header">
            <h3>Tables</h3>
          </div>
          <div className="tables-list">{content}</div>
        </>
      )}
    </main>
  );
}

export default TablesDisplay;