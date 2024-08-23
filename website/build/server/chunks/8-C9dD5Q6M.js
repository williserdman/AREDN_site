import { d as db } from './database-DX5yD0gH.js';
import { e as error } from './index-Dnzf2XsT.js';
import 'better-sqlite3';

async function load({ params }) {
  const getData = async () => {
    const requestedAttribute = params.attribute;
    console.log(requestedAttribute);
    try {
      if (isNumeric(requestedAttribute)) {
        throw error(404);
      }
      const stmt = db.prepare(`SELECT sensorID, ${requestedAttribute}, createdAt FROM sensor_data`);
      const rows = stmt.all();
      const result = {};
      for (const row of rows) {
        const { sensorID: id, [requestedAttribute]: attribute, createdAt: time } = row;
        if (!result[id]) {
          result[id] = { attribute: [], time: [] };
        }
        result[id].attribute.push(attribute);
        result[id].time.push(time);
      }
      return result;
    } catch (e) {
      console.log(e);
      error(404, { message: "Attribute not found!" });
    }
  };
  return {
    status: 200,
    oneAttributeData: await getData(),
    attributeName: params.attribute
  };
}
function isNumeric(str) {
  if (typeof str != "string") return false;
  return (
    //@ts-ignore
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  );
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-FmYuIzji.js')).default;
const server_id = "src/routes/meshtastic/[attribute]/+page.server.ts";
const imports = ["_app/immutable/nodes/8.5rgar_4M.js","_app/immutable/chunks/scheduler.Cr2NSsBU.js","_app/immutable/chunks/index.Kej8iNlk.js","_app/immutable/chunks/helpers.Ba4Tvldy.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-C9dD5Q6M.js.map
