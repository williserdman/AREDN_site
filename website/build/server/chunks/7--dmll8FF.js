import { d as db } from './database-DX5yD0gH.js';
import { f as fail } from './index-Dnzf2XsT.js';
import 'better-sqlite3';

function load({}) {
  const stmt = db.prepare("SELECT * from sensor_configs");
  const configs = stmt.all();
  return {
    status: 200,
    configs
  };
}
const actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const config1 = formData.get("config1");
    const config2 = formData.get("config2");
    if (id === "" || config1 === "" || config2 === "") {
      return fail(400, {
        error: true,
        message: "All fields must have a value."
      });
    }
    const stmt = db.prepare(
      "INSERT or REPLACE into sensor_configs (sensorID, config1, config2) VALUES (?, ?, ?)"
    );
    stmt.run(id, config1, config2);
    return {
      success: true
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BwN-vSLc.js')).default;
const server_id = "src/routes/meshtastic/+page.server.ts";
const imports = ["_app/immutable/nodes/7.CA7P6NmS.js","_app/immutable/chunks/scheduler.Cr2NSsBU.js","_app/immutable/chunks/index.Kej8iNlk.js","_app/immutable/chunks/entry.BHqCWWo6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7--dmll8FF.js.map
