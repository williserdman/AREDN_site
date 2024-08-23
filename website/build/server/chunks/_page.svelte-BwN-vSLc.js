import { c as create_ssr_component, h as each, e as escape, f as add_attribute } from './ssr-J105qSQX.js';
import './client-BUusD8wq.js';
import './exports-BGi7-Rnc.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const { configs } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<p data-svelte-h="svelte-1cepb9e">this is the home page. not sure what to put here so far.. maybe a map? or could be the admin
	panel. probably should put at least some warning modal or something</p> ${each(configs, (config) => {
    return `<div class="container"><div class="title is-size-4 mt-5 mb-2">${escape(config.sensorID)}</div> <form method="POST" action="?/update"><div><input type="hidden" hidden${add_attribute("value", config.sensorID, 0)} name="id"></div> <div><label for="" class="label" data-svelte-h="svelte-s2qcs0">config1</label> <input type="text" class="input" name="config1"${add_attribute("value", config.config1, 0)}></div> <div><label for="" class="label" data-svelte-h="svelte-d0vk1f">config2</label> <input type="text" class="input" name="config2"${add_attribute("value", config.config2, 0)}></div> <div class="m-2" data-svelte-h="svelte-1cqc3wy"><button class="button is-primary">Update</button> </div></form> </div>`;
  })} <div class="container" data-svelte-h="svelte-19nsjcv"><div class="title is-2 mt-5 mb-2">MANUAL SETUP</div> <form action="?/update" method="POST"><div><lable class="label">Sensor ID</lable> <input type="text" class="input" name="id"></div> <div><label for="" class="label">config1</label> <input type="text" class="input" name="config1"></div> <div><label for="" class="label">config2</label> <input type="text" class="input" name="config2"></div> <div class="m-2"><button class="button is-primary">Update</button></div></form></div> <div class="container"><h1 class="title is-2 mt-5" data-svelte-h="svelte-17iujbe">utils</h1> <button class="button is-primary" data-svelte-h="svelte-6tgkph">download csv</button></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BwN-vSLc.js.map
