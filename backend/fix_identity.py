"""Patch script: correct identity mismatch in live database."""
import sqlite3

# Fix the root database (the one that's actually used)
for db_path in ['wensure.db', 'backend/wensure.db']:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM users")
    count = cur.fetchone()[0]
    if count == 0:
        print(f"{db_path}: empty, skipping")
        conn.close()
        continue

    cur.execute("UPDATE users SET full_name=? WHERE id=?", ('Bharat Shishodia', 'usr-customer-01'))
    print(f"{db_path} users updated: {cur.rowcount}")

    cur.execute("UPDATE projects SET client_name=? WHERE id=?", ('Bharat Shishodia', 'proj-baner-villa-01'))
    print(f"{db_path} projects updated: {cur.rowcount}")

    conn.commit()

    cur.execute("SELECT full_name, email, role FROM users WHERE id=?", ('usr-customer-01',))
    print(f"  User record: {cur.fetchone()}")

    cur.execute("SELECT client_name, name FROM projects WHERE id=?", ('proj-baner-villa-01',))
    print(f"  Project record: {cur.fetchone()}")

    conn.close()

print("Done.")
