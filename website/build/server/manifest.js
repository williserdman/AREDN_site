const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","json-historic"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.9nWJexk_.js","app":"_app/immutable/entry/app.D5I87dPc.js","imports":["_app/immutable/entry/start.9nWJexk_.js","_app/immutable/chunks/entry.BHqCWWo6.js","_app/immutable/chunks/scheduler.Cr2NSsBU.js","_app/immutable/entry/app.D5I87dPc.js","_app/immutable/chunks/scheduler.Cr2NSsBU.js","_app/immutable/chunks/index.Kej8iNlk.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-BWZy6dAH.js')),
			__memo(() => import('./chunks/1-DoP208dX.js')),
			__memo(() => import('./chunks/2-153wo9L0.js')),
			__memo(() => import('./chunks/3-CpEPN9eX.js')),
			__memo(() => import('./chunks/4-B9181rSD.js')),
			__memo(() => import('./chunks/5-C3UeWACe.js')),
			__memo(() => import('./chunks/6-BjBgJxeW.js')),
			__memo(() => import('./chunks/7--dmll8FF.js')),
			__memo(() => import('./chunks/8-C9dD5Q6M.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/api/export",
				pattern: /^\/api\/export\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B6VxPVck.js'))
			},
			{
				id: "/api/sensors",
				pattern: /^\/api\/sensors\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BE6BUFD5.js'))
			},
			{
				id: "/aprs",
				pattern: /^\/aprs\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/meshtastic",
				pattern: /^\/meshtastic\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/meshtastic/[attribute]",
				pattern: /^\/meshtastic\/([^/]+?)\/?$/,
				params: [{"name":"attribute","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 8 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
