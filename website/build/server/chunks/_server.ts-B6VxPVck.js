import { d as db } from './database-DX5yD0gH.js';
import { AsyncParser } from '@json2csv/node';
import 'better-sqlite3';

const GET = async ({ request }) => {
  const stmt = db.prepare("SELECT * FROM sensor_data");
  const info = stmt.all();
  const parser = new AsyncParser();
  const csv = await parser.parse(info).promise();
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="database.csv"'
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-B6VxPVck.js.map
