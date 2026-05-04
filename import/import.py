import pandas as pd
import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="project_tracker"
)
cursor = conn.cursor()

# Load CSV
df = pd.read_csv("projects.csv")

# Import projects
projects = df[["project_id", "project_name", "project_manager", "start_date", "end_date", "overall_status"]].drop_duplicates()

for _, row in projects.iterrows():
    cursor.execute("""
        INSERT IGNORE INTO projects (id, project_name, project_manager, start_date, end_date, overall_status)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (row.project_id, row.project_name, row.project_manager, row.start_date, row.end_date, row.overall_status))

# Import steps
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO project_steps (project_id, step_name, step_status, step_due_date)
        VALUES (%s, %s, %s, %s)
    """, (row.project_id, row.step_name, row.step_status, row.step_due_date))

# Import document approvals
for _, row in df.iterrows():
    approved_by = None if pd.isna(row.approved_by) else row.approved_by
    cursor.execute("""
        INSERT INTO document_approvals (project_id, document_name, approval_status, approved_by)
        VALUES (%s, %s, %s, %s)
    """, (row.project_id, row.document_name, row.approval_status, approved_by))

conn.commit()
cursor.close()
conn.close()
print("Import done!")