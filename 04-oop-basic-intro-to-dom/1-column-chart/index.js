export default class ColumnChart {
  chartHeight = 50;

  constructor(props = {}) {
    this._init(props);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
  }

  update(props = {}) {
    this._init(props);
  }

  _init({data, label, value, link, formatHeading = h => h}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this._createElement();
  }

  _createElement() {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = this._render();
    return tempDiv.firstElementChild;
  }

  _columnsHtml() {
    if (!this.data) { return ""; }

    let maxDataValue = Math.max(...this.data);
    return (
      this.data
        .map((value) => {
          let height = Math.floor(this.chartHeight * value / maxDataValue);
          let percent = (100 * value / maxDataValue).toFixed();
          return `<div style="--value: ${height}" data-tooltip="${percent}%"></div>`;
        })
        .join("")
    );
  }

  _linkHtml() {
    if (!this.link) { return ""; }

    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }

  _render() {
    return `
      <div class="column-chart ${this.data || "column-chart_loading"}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this._linkHtml()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this._columnsHtml() }
          </div>
        </div>
      </div>
    `;
  }
}
