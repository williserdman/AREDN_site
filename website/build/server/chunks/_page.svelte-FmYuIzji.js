import { c as create_ssr_component, o as onDestroy, f as add_attribute } from './ssr-J105qSQX.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function formatDate(today) {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  onDestroy(() => {
  });
  const yesterday = new Date(/* @__PURE__ */ (/* @__PURE__ */ new Date()).setDate(
    /* @__PURE__ */ (/* @__PURE__ */ new Date()).getDate() - 1
  ));
  const tommorow = new Date(/* @__PURE__ */ (/* @__PURE__ */ new Date()).setDate(/* @__PURE__ */ (/* @__PURE__ */ new Date()).getDate() + 1));
  let startDate;
  let endDate;
  let stringDateStart = formatDate(yesterday);
  let stringDateEnd = formatDate(tommorow);
  changeDateRange();
  function changeDateRange() {
    startDate = new Date(stringDateStart);
    endDate = new Date(stringDateEnd);
    if (startDate > endDate) {
      return;
    }
    data = data;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<div class="container mt-6"><canvas id="myChart"></canvas> ${`<div class="has-text-centered m-4 is-size-2" data-svelte-h="svelte-17yjkdf"><p>Loading Data...</p></div>`} <form action=""><div class="columns has-text-centered"><div class="column"><p data-svelte-h="svelte-1cdboys">Start Date</p> <input type="date"${add_attribute("value", stringDateStart, 0)}></div> <div class="column"><p data-svelte-h="svelte-soaif5">End Date</p> <input type="date"${add_attribute("value", stringDateEnd, 0)}></div> <div class="column is-centered"><button class="button is-primary" data-svelte-h="svelte-1ewxjgn">Go</button></div></div></form></div> `;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-FmYuIzji.js.map
