import { useState, useEffect, useCallback } from "react";
import ClientList from "./components/ClientList";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import AddTaskForm from "./components/AddTaskForm";
import SummaryStats from "./components/SummaryStats";
import * as api from "./api";
import "./App.css";

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClients = useCallback(async () => {
    try {
      const data = await api.getClients(search);
      setClients(data);
    } catch (err) {
      setError("Failed to load clients");
    }
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const fetchTasks = useCallback(async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      const data = await api.getTasks(selectedClient.id, filters);
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [selectedClient, filters]);

  useEffect(() => {
    if (selectedClient) {
      fetchTasks();
    }
  }, [selectedClient, fetchTasks]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setFilters({});
    setShowAddForm(false);
    setError("");
  };

  const handleAddTask = async (taskData) => {
    await api.createTask(selectedClient.id, taskData);
    setShowAddForm(false);
    await fetchTasks();
    await fetchClients();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      await fetchTasks();
      await fetchClients();
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Compliance Tracker</h1>
        <p>Track and manage compliance tasks across clients</p>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <ClientList
            clients={clients}
            selectedClient={selectedClient}
            onSelect={handleSelectClient}
            search={search}
            onSearchChange={setSearch}
          />
        </aside>

        <main className="main-content">
          {!selectedClient ? (
            <div className="welcome-state">
              <div className="welcome-icon">&#128203;</div>
              <h2>Welcome to Compliance Tracker</h2>
              <p>Select a client from the sidebar to view and manage their compliance tasks.</p>
            </div>
          ) : (
            <>
              <div className="content-header">
                <div>
                  <h2>{selectedClient.company_name}</h2>
                  <p className="client-meta">
                    {selectedClient.entity_type} &middot; {selectedClient.country}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "Cancel" : "+ Add Task"}
                </button>
              </div>

              {showAddForm && (
                <AddTaskForm
                  onSubmit={handleAddTask}
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              <SummaryStats tasks={tasks} />

              <TaskFilters filters={filters} onFilterChange={setFilters} />

              {error && <div className="error-banner">{error}</div>}

              {loading ? (
                <p className="loading">Loading tasks...</p>
              ) : (
                <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
