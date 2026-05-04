const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

app.get('/projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/projects/:id', (req, res) => {
  db.query('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

app.get('/projects/:id/steps', (req, res) => {
  db.query('SELECT * FROM project_steps WHERE project_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/projects/:id/document-approvals', (req, res) => {
  db.query('SELECT * FROM document_approvals WHERE project_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/dashboard/summary', (req, res) => {
  const summary = {};
  
  db.query("SELECT COUNT(*) as total FROM projects", (err, r1) => {
    if (err) return res.status(500).json({ error: err.message });
    summary.total_projects = r1[0].total;
    
    // Fixed query: Changed 'delayed' to 'delayed_count' to avoid MySQL reserved keyword error
    db.query("SELECT COUNT(*) as delayed_count FROM projects WHERE overall_status = 'Delayed'", (err, r2) => {
      if (err) return res.status(500).json({ error: err.message });
      summary.delayed_projects = r2[0].delayed_count; // Updated reference here too
      
      db.query("SELECT COUNT(*) as pending FROM document_approvals WHERE approval_status = 'Pending'", (err, r3) => {
        if (err) return res.status(500).json({ error: err.message });
        summary.pending_approvals = r3[0].pending;
        
        db.query("SELECT COUNT(*) as rejected FROM document_approvals WHERE approval_status = 'Rejected'", (err, r4) => {
          if (err) return res.status(500).json({ error: err.message });
          summary.rejected_approvals = r4[0].rejected;
          
          res.json(summary);
        });
      });
    });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));