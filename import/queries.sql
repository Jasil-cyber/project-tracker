-- 1. Projects by overall status
SELECT overall_status, COUNT(*) as total
FROM projects
GROUP BY overall_status;

-- 2. Pending approvals by project
SELECT p.project_name, COUNT(*) as pending_count
FROM document_approvals da
JOIN projects p ON da.project_id = p.id
WHERE da.approval_status = 'Pending'
GROUP BY p.project_name;

-- 3. Rejected approvals by project
SELECT p.project_name, COUNT(*) as rejected_count
FROM document_approvals da
JOIN projects p ON da.project_id = p.id
WHERE da.approval_status = 'Rejected'
GROUP BY p.project_name;

-- 4. Delayed steps by project
SELECT p.project_name, COUNT(*) as delayed_steps
FROM project_steps ps
JOIN projects p ON ps.project_id = p.id
WHERE ps.step_status = 'Delayed'
GROUP BY p.project_name;

-- 5. Overall project summary
SELECT p.project_name, p.overall_status,
  COUNT(DISTINCT ps.id) as total_steps,
  COUNT(DISTINCT da.id) as total_documents
FROM projects p
LEFT JOIN project_steps ps ON ps.project_id = p.id
LEFT JOIN document_approvals da ON da.project_id = p.id
GROUP BY p.id, p.project_name, p.overall_status;