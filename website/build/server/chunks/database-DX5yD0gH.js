import Database from 'better-sqlite3';

const db = new Database("my-database.db", { verbose: console.log });
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
    `);

export { db as d };
//# sourceMappingURL=database-DX5yD0gH.js.map
