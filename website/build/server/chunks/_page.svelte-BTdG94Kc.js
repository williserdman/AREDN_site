import { c as create_ssr_component, f as add_attribute, e as escape, v as validate_component, o as onDestroy } from './ssr-J105qSQX.js';
import './client-BUusD8wq.js';
import 'chart.js/auto';
import './exports-BGi7-Rnc.js';

const APRSGraphs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const charts = [];
  let chartCanvas1 = null;
  let chartCanvas2 = null;
  let chartCanvas3 = null;
  let chartCanvas4 = null;
  let chartCanvas5 = null;
  onDestroy(() => {
    charts.forEach((chart) => chart.destroy());
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<div><h1>${escape(data[0].projectName)}</h1> <div><canvas${add_attribute("this", chartCanvas1, 0)}></canvas> <canvas${add_attribute("this", chartCanvas2, 0)}></canvas> <canvas${add_attribute("this", chartCanvas3, 0)}></canvas> <canvas${add_attribute("this", chartCanvas4, 0)}></canvas> <canvas${add_attribute("this", chartCanvas5, 0)}></canvas></div></div>`;
});
function parseString(input) {
  const projectSeqRegex = /^(.+?): Seq=(\d+),/;
  const projectSeqMatch = input.match(projectSeqRegex);
  if (!projectSeqMatch) {
    return null;
  }
  const projectName = projectSeqMatch[1];
  const sequence = parseInt(projectSeqMatch[2], 10);
  const channelRegex = /(\w+)=([\d.]+) ([\w^%]+)/g;
  let match;
  const channels = [];
  while ((match = channelRegex.exec(input)) !== null) {
    channels.push({
      name: match[1],
      value: parseFloat(match[2]),
      unit: match[3]
    });
  }
  return { projectName, sequence, channels };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let callsignForm;
  let info = null;
  let telemetry = null;
  let callsignFormDate;
  let { data } = $$props;
  let { form } = $$props;
  info = data.info;
  let newTelem;
  function formSubmit() {
    info = data.info;
    if (form) {
      callsignFormDate.value = form.date;
      newTelem = false;
      if (form.status == 200) {
        console.log(form);
        info = form.info;
        telemetry = form.telemetry;
        callsignForm.value = form.id;
        newTelem = telemetry.map((t, index) => {
          const dataObj = parseString(t);
          if (dataObj != null) {
            dataObj["time"] = form.times[index];
            return dataObj;
          }
        });
        newTelem = newTelem.filter((data2) => data2 !== void 0);
        console.log(newTelem);
      } else {
        info = form.info;
        newTelem = false;
      }
    }
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  {
    formSubmit();
  }
  return `<form action="?/callsign" method="POST"><div class="mx-4"><div class="field is-grouped"><input type="text" name="id" class="input is-rounded" placeholder="N0CALL-1"${add_attribute("this", callsignForm, 0)}> <input type="date" name="date"${add_attribute("this", callsignFormDate, 0)}> <button class="button is-primary" data-svelte-h="svelte-vfk9fk">go</button></div></div></form> ${info ? `${newTelem ? `<div style="width: 60%; margin-left: auto; margin-right: auto;">${validate_component(APRSGraphs, "Graphs").$$render($$result, { data: newTelem }, {}, {})}</div> <div data-svelte-h="svelte-1po5v8r">graph above</div>` : `<h4 style="margin-bottom: 0;" data-svelte-h="svelte-rfzv0k">enter a callsign and extension to filter</h4> <p style="margin-top: 0;" data-svelte-h="svelte-1l0mw8">N0CALL-X</p> <h4 data-svelte-h="svelte-1jdi1tg">raw data</h4> <div>${escape(info)}</div>`}` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BTdG94Kc.js.map
