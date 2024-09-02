import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

export default class Page {
  constructor() {
    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.element = Helpers.createElementFromTemplate(this._createTemplate());
    this.subElements = this._getSubElements(this.element);

    this.rangePicker = new RangePicker({
      from: from,
      to: to,
    });

    this.ordersChart = new ColumnChart({
      label: 'Orders',
      link: '#',
      url: 'api/dashboard/orders',
      range: {
        from: from,
        to: to,
      }
    });

    this.salesChart = new ColumnChart({
      label: 'Sales',
      link: '#',
      formatHeading: data => `$${data}`,
      url: 'api/dashboard/sales',
      range: {
        from: from,
        to: to,
      }
    });

    this.customersChart = new ColumnChart({
      label: 'Customers',
      link: '#',
      url: 'api/dashboard/customers',
      range: {
        from: from,
        to: to,
      }
    });

    this.initTable(from, to);
  }

  render() {
    this.subElements.rangePicker.append(this.rangePicker.element);
    this.subElements.ordersChart.append(this.ordersChart.element);
    this.subElements.salesChart.append(this.salesChart.element);
    this.subElements.customersChart.append(this.customersChart.element);
    this.subElements.sortableTable.append(this.SortableTable.element);
    this._addEventListeners();
    return this.element;
  }

  _addEventListeners() {
    this.element.addEventListener('date-select', this._onDateSelect);
  }

  _removeEventListeners() {
    this.element.removeEventListener('date-select', this._onDateSelect);
  }

  _onDateSelect = event => {
    const { from, to } = event.detail;

    this.from = from;
    this.to = to;

    this.ordersChart.loadData(this.from, this.to);
    this.salesChart.loadData(this.from, this.to);
    this.customersChart.loadData(this.from, this.to);

    this.SortableTable.destroy();
    this.initTable(from, to)
    this.subElements.sortableTable.append(this.SortableTable.element);
  }

  initTable(from, to) {
    let image_template = (data) => {
      return `
        <div class="sortable-table__cell">
          <img class="sortable-table-image" src="${data[0].url}">
        </div>
      `;
    };
    this.SortableTable = new SortableTable(
      [
        {id: 'images', title: 'Image', sortable: false, template: image_template},
        {id: 'title', title: 'Name', sortable: true},
        {id: 'category', title: 'Category', sortable: false},
        {id: 'quantity', title: 'Quantity', sortable: true},
        {id: 'price', title: 'Price', sortable: true},
        {id: 'sales', title: 'Sales', sortable: true},
      ],
      {
        url: `api/dashboard/bestsellers?from=${from.toISOString()}&to=${to.toISOString()}`,
        isSortLocally: true,
      }
    );
  }

  _getSubElements(element) {
    const subElements = {};

    for (const subElement of element.querySelectorAll('[data-element]')) {
      subElements[subElement.dataset.element] = subElement;
    }

    return subElements;
  }

  _createTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <!-- RangePicker component -->
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    `;
  }

  destroy() {
    this._removeEventListeners();
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}
