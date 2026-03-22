import { useState } from "react";

export default function ClientList({ clients, selectedClient, onSelect, search, onSearchChange }) {
  return (
    <div className="client-list">
      <h2>Clients</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="client-items">
        {clients.length === 0 && (
          <p className="empty-state">No clients found</p>
        )}
        {clients.map((client) => (
          <div
            key={client.id}
            className={`client-card ${selectedClient?.id === client.id ? "active" : ""}`}
            onClick={() => onSelect(client)}
          >
            <div className="client-card-header">
              <h3>{client.company_name}</h3>
              <span className="entity-badge">{client.entity_type}</span>
            </div>
            <p className="client-country">{client.country}</p>
            <div className="client-stats">
              <span className="stat">
                <span className="stat-num">{client.total_tasks || 0}</span> total
              </span>
              <span className="stat pending">
                <span className="stat-num">{client.pending_tasks || 0}</span> pending
              </span>
              {(client.overdue_tasks || 0) > 0 && (
                <span className="stat overdue">
                  <span className="stat-num">{client.overdue_tasks}</span> overdue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
