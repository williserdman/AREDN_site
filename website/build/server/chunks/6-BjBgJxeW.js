import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

const getAllData = async () => {
  const filePath = path.resolve("2024-07-23.log");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent;
};
async function load() {
  return {
    status: 200,
    info: await getAllData()
  };
}
const actions = {
  callsign: async ({ request }) => {
    const formData = await request.formData();
    let id = formData.get("id");
    let date = formData.get("date");
    console.log(date);
    console.log(id);
    let filePath, fileContent;
    try {
      filePath = path.resolve(`${date}.log`);
      fileContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      return {
        status: 404,
        info: `no such file ${date}.log`
      };
    }
    if (id == "") {
      return {
        status: 404,
        info: await getAllData()
      };
    }
    const records = await new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          // Assuming the first row contains headers
          trim: true
        },
        (err, output) => {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        }
      );
    });
    id = id?.toString().toUpperCase();
    const procRecs = [];
    records.map((r) => {
      r["name"] == id ? procRecs.push(r) : {};
    });
    if (procRecs.length <= 0) {
      return {
        status: 404,
        info: `no data for ${id}`
      };
    }
    const telems = procRecs.map((r) => r["telemetry"]);
    const times = procRecs.map((r) => r["utime"]);
    const csvString = await new Promise((resolve, reject) => {
      stringify(
        procRecs,
        {
          header: true
          // Include headers in the output CSV
        },
        (err, output) => {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        }
      );
    });
    return {
      status: 200,
      info: csvString,
      id,
      telemetry: telems,
      times,
      date
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BTdG94Kc.js')).default;
const server_id = "src/routes/aprs/+page.server.ts";
const imports = ["_app/immutable/nodes/6.dw_6x9HP.js","_app/immutable/chunks/scheduler.Cr2NSsBU.js","_app/immutable/chunks/index.Kej8iNlk.js","_app/immutable/chunks/entry.BHqCWWo6.js","_app/immutable/chunks/helpers.Ba4Tvldy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-BjBgJxeW.js.map
