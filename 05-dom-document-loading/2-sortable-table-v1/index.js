export default class SortableTable {
  static sorters = {
    string: (a, b) => a.localeCompare(b, ["ru", "en"]),
    number: (a, b) => a - b
  }
  activeSortColumnId;
  activeSortOrder;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this._createElement();
  }

  sort(columnId, order) {
    this.activeSortColumnId = columnId;
    this.activeSortOrder = order;

    this._sortData();
    this._rerender();
  }

  destroy() {
    this.element.remove();
  }

  get subElements() {
    return {
      body: this.element.querySelector(".sortable-table__body"),
    };
  }

  _getSorter() {
    const columnIndex =
      this
      .headerConfig
      .findIndex((item) => item.id === this.activeSortColumnId);

    return SortableTable.sorters[this.headerConfig[columnIndex].sortType];
  }

  _sortData() {
    const sorter = this._getSorter();

    this.data.sort((aData, bData) => {
      const a = aData[this.activeSortColumnId];
      const b = bData[this.activeSortColumnId];
      return this.activeSortOrder === "asc" ? sorter(a, b) : sorter(b, a);
    });
  }

  _rerender() {
    const newElement = this._createElement();

    this.element.replaceWith(newElement);
    this.element = newElement;
  }

  _createElement() {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = this._createTemplate();
    return tempDiv.firstElementChild;
  }

  _createTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this._createHeaderTemplate()}
          ${this._createBodyTemplate()}
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _createHeaderTemplate() {
    let itemsTemplate =
      this
      .headerConfig
      .map((item) => this._createHeaderItemTemplate(item))
      .join("");

    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${itemsTemplate}
      </div>
    `;
  }

  _createHeaderItemTemplate(item) {
    let arrowTemplate = "";
    if (this.activeSortColumnId === item.id) {
      arrowTemplate = `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      `;
    }

    const dataOrder = this.activeSortOrder ? `data-order="${this.activeSortOrder}"` : "";

    return `
      <div
        class="sortable-table__cell"
        data-id="${item.id}"
        data-sortable="${item.sortable}"
        ${dataOrder}
      >
        <span>${item.title}</span>
        ${arrowTemplate}
      </div>
    `;
  }

  _createBodyTemplate() {
    let itemsTemplate =
      this
      .data
      .map((item) => this._createBodyItemTemplate(item))
      .join("");

    return `
      <div data-element="body" class="sortable-table__body">
        ${itemsTemplate}
      </div>
    `;
  }

  _createBodyItemTemplate(item) {
    const cellsTemplate =
      this
      .headerConfig
      .map((headerItem) => {
        if (headerItem.template) {
          return headerItem.template(item[headerItem.id]);
        } else {
          return `<div class="sortable-table__cell">${item[headerItem.id]}</div>`;
        }
      })
      .join("");
    return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${cellsTemplate}
      </a>
    `;
  }
}
