// src/lib/database.ts
import Database from 'better-sqlite3';

// Initialize the database connection
const db = new Database('my-database.db', { verbose: console.log });

// Create a table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sensor_data (
    sensorID TEXT,
    CO2 REAL,
    temperature REAL,
    humidity REAL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS sensor_configs (
        sensorID TEXT PRIMARY KEY,
        config1 TEXT,
        config2 REAL
    )
    `)

export function queryAll(table: string = "sensor_data") {
    const stmt = db.prepare(`SELECT * FROM ${table}`);
    return stmt.all();
}

export { db };
