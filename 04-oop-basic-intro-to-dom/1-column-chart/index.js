export default class ColumnChart {
  chartHeight = 50;

  constructor(props = {}) {
    this._init(props);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(newData) {
    this.data = newData;

    this._rerenderElement();
  }

  _rerenderElement() {
    const oldElement = this.element;
    this.element = this._createElement();
    oldElement.replaceWith(this.element);
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
    tempDiv.innerHTML = this._createTemplate();
    return tempDiv.firstElementChild;
  }

  _createColumnsTemplate() {
    if (this._isLoading()) { return ""; }

    let columnValues = this._buildColumnValues();
    let maxDataValue = Math.max(...columnValues);
    return (
      columnValues
        .map((value) => {
          let height = Math.floor(this.chartHeight * value / maxDataValue);
          let percent = (100 * value / maxDataValue).toFixed();
          return `<div style="--value: ${height}" data-tooltip="${percent}%"></div>`;
        })
        .join("")
    );
  }

  _linkTemplate() {
    if (!this.link) { return ""; }

    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }

  _createChartClasses() {
    let classes = ["column-chart"];
    if (this._isLoading()) { classes.push("column-chart_loading"); }

    return classes.join(" ");
  }

  _createTemplate() {
    return `
      <div class="${this._createChartClasses()}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this._linkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this._createColumnsTemplate()}
          </div>
        </div>
      </div>
    `;
  }

  _buildColumnValues() {
    return this.data;
  }

  _isLoading() {
    return !this.data || this.data.length === 0;
  }
}
