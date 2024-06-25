import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  constructor(
    {
      url = "",
      range = {from: "", to: ""},
      value = 0,
      label = "",
      link = "",
      formatHeading = h => h
    } = {}
  ) {
    super({data: {}, label, value: value, link, formatHeading});

    this.url = url;
    this.range = range;
    this.update(this.range.from, this.range.to);
  }

  async update(from, to) {
    this.range = {from, to};

    // Set loaidng state and rerender
    this.data = {};
    this._rerenderElement();

    this.data = await fetchJson(this._buildUrl());
    this.value = this._buildColumnValues().reduce((a, b) => a + b, 0);

    this._rerenderElement();

    return this.data;
  }

  get subElements() {
    return {
      body: this.element.querySelector('.column-chart__chart'),
    };
  }

  _buildUrl() {
    let url = new URL(BACKEND_URL);
    url.pathname = this.url;
    url.searchParams.set('from', this.range.from);
    url.searchParams.set('to', this.range.to);

    return url;
  }

  _buildColumnValues() {
    return Object.values(this.data);
  }

  _isLoading() {
    return this._buildColumnValues().length === 0;
  }
}
