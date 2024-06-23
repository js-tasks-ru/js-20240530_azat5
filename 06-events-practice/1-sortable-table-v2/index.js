import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

const eventName = "pointerdown";

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {data = [], sorted: {id, order} = {}} = {}) {
    super(headersConfig, data);

    this.activeSortColumnId = id;
    this.activeSortOrder = order;

    this.sort(id, order);
    this._createEventListeners();
  }

  destroy() {
    super.destroy();

    this._destroyEventListeners();
  }

  _createEventListeners() {
    this.element.addEventListener(eventName, this._handleElementClick);
  }

  // Use arrow function to bind SortableTable instance as `this`
  _handleElementClick = (e) => {
    const cellElement = e.target.closest('[data-sortable="true"]');
    if (!cellElement) { return; }

    const columnId = cellElement.dataset.id;
    const order = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';
    this.sort(columnId, order);
  }

  _destroyEventListeners() {
    this.element.removeEventListener(eventName, this._handleElementClick);
  }
}
