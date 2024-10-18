// client/src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [contact, setContact] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/employees', { headers: { Authorization: `Bearer ${token}` } });
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editId) {
      await axios.put(`/api/employees/${editId}`, { name, email, jobTitle, department, hireDate, contact }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post('/api/employees', { name, email, jobTitle, department, hireDate, contact }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    resetForm();
    fetchEmployees();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setJobTitle('');
    setDepartment('');
    setHireDate('');
    setContact('');
    setEditId(null);
  };

  const handleEdit = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setJobTitle(employee.jobTitle);
    setDepartment(employee.department);
    setHireDate(employee.hireDate.substring(0, 10));
    setContact(employee.contact);
    setEditId(employee._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEmployees();
  };

  return (
    <div className="container">
      <h2>Employee List</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        <input type="date" className="form-control mb-2" value={hireDate} onChange={(e) => setHireDate(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <button type="submit" className="btn btn-primary mb-2">
          {editId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
      <ul className="list-group">
        {employees.map(employee => (
          <li key={employee._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{employee.name}</h5>
              <p>{employee.email} - {employee.jobTitle}</p>
              <small>{employee.department}</small>
            </div>
            <div>
              <button className="btn btn-warning" onClick={() => handleEdit(employee)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(employee._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;

