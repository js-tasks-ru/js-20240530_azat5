import SortableList from '../2-sortable-list/index.js';
import ProductFormV1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

export default class ProductForm extends ProductFormV1 {
  _appendImageList() {
    const items = this.productData.images.map(({ url, source }, index) => {
      const template = this._createImageTemplate(url, source, index);
      return Helpers.createElementFromTemplate(template);
    });
    const sortableList = new SortableList({ items: items });
    this.subElements.imageListContainer.append(sortableList.element);
  }
}
