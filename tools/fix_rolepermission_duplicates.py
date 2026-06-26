import os
import shutil
import sqlite3

DB = os.path.join(os.path.dirname(__file__), '..', 'db.sqlite3')
DB = os.path.abspath(DB)
BACKUP = DB + '.bak'

if not os.path.exists(DB):
    print(f"Database not found at {DB}")
    raise SystemExit(1)

print(f"Backing up {DB} to {BACKUP}")
shutil.copy2(DB, BACKUP)

conn = sqlite3.connect(DB)
cur = conn.cursor()

print('Removing duplicate role-permission rows...')
cur.execute("DELETE FROM accounts_rolepermission WHERE rowid NOT IN (SELECT MIN(rowid) FROM accounts_rolepermission GROUP BY role_id, permission_id);")
conn.commit()

print('Vacuuming database...')
cur.execute('VACUUM;')
conn.close()

print('Duplicates removed and DB vacuumed. Backup created.')
