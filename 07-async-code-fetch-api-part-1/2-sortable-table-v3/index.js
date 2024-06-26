import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

export default class SortableTable extends SortableTableV2 {
  static defaultStart = 0;
  static defaultStep = 30;

  loadMoreTimeout = false;

  constructor(
    headersConfig,
    {
      sorted: {id, order} = {},
      url = "",
      isSortLocally = false,
    } = {}
  ) {
    id ||= headersConfig[0].id;
    super(headersConfig, {data: [], sorted: {id, order}});
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.start = SortableTable.defaultStart;
    this.end = SortableTable.defaultStep;

    this.render();
  }

  sortOnClient(id, order) {
    super.sort(id, order);
  }

  sortOnServer(id, order) {
    this.activeSortColumnId = id;
    this.activeSortOrder = order;
    this.start = SortableTable.defaultStart;
    this.end = SortableTable.defaultStep;
    this.render();
    this._rerenderHeader();
  }

  _createEventListeners() {
    super._createEventListeners();
    // window.addEventListener('scroll', this._handleWidnowScroll);
    window.addEventListener('scroll', () => this._handleWidnowScroll());
  }

  destroy() {
    super.destroy();
    window.removeEventListener('scroll', this._handleWidnowScroll);
  }

  _handleWidnowScroll = (_e) => {
    const {bottom} = this.element.getBoundingClientRect();
    if (bottom < document.documentElement.clientHeight) {
      if (this.loadMoreTimeout) { return; }
      this.loadMoreTimeout = true;
      this._loadMoreData();
      setTimeout(() => this.loadMoreTimeout = false, 500);
    }
  }

  async _loadMoreData() {
    this.start = this.end;
    this.end += SortableTable.defaultStep;
    this._buildUrl();

    const data = await fetchJson(this._buildUrl());
    this.data = this.data.concat(data);

    const newElement = Helpers.createElementFromTemplate(this._createBodyTemplate());
    this.subElements.body.replaceWith(newElement);
  }

  _buildUrl() {
    const url = new URL(BACKEND_URL);
    url.pathname = this.url;
    url.searchParams.set('_sort', this.activeSortColumnId);
    url.searchParams.set('_order', this.activeSortOrder);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);
    return url;
  }

  async render() {
    const data = await fetchJson(this._buildUrl());
    this.data = data;

    const newElement = Helpers.createElementFromTemplate(this._createBodyTemplate());
    this.subElements.body.replaceWith(newElement);
  }

  _sortFunction(id, order) {
    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }
}
