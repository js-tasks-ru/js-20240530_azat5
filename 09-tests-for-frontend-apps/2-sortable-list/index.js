export default class SortableList {
  constructor({ items }) {
    this.items = items;
    this.element = this._createElement();
    this._addEventListeners();
  }

  destroy() {
    this._removeEventListeners();
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  _createElement() {
    const element = document.createElement('ul');
    element.className = 'sortable-list';
    for (const item of this.items) {
      item.classList.add('sortable-list__item');
    }
    element.append(...this.items);
    return element;
  }

  _startDrag(event, grabHandleElement) {
    this.draggingElement = grabHandleElement.closest('.sortable-list__item');
    this._initDragPosition(event);

    this._createPlaceholder();

    document.addEventListener("pointermove", this._handleDocumentPointerMove);
    document.addEventListener("pointerup", this._handleDocumentPointerup);
  }

  _moveDrag(event) {
    this._setDragPosition(event);

    // locate hovered element
    const newHoveredElement = this.items.find((item) => {
      if (item === this.draggingElement) {
        return false;
      }
      const rect = item.getBoundingClientRect();
      return event.clientY > rect.top && event.clientY < rect.bottom;
    }) || null;

    if (newHoveredElement === this.hoveredElement) { return; }

    this.hoveredElement = newHoveredElement;
    if (!this.hoveredElement) { return; }

    // move placeholder if hovered element changed
    if (this.hoveredElement.compareDocumentPosition(this.placeholderElement) & Node.DOCUMENT_POSITION_FOLLOWING) {
      this.hoveredElement.before(this.placeholderElement);
    } else {
      this.hoveredElement.after(this.placeholderElement);
    }
  }

  _endDrag() {
    // reset positioning
    this.draggingElement.style.width = '';
    this.draggingElement.style.transform = '';
    this.draggingElement.style.left = '';
    this.draggingElement.style.top = '';
    this.draggingElement.classList.remove('sortable-list__item_dragging');

    // put dragging element to the new place
    this.placeholderElement.replaceWith(this.draggingElement);

    document.removeEventListener("pointermove", this._handleDocumentPointerMove);
    document.removeEventListener("pointerup", this._handleDocumentPointerup);
  }

  _removeItem(deleteHandleElement) {
    const item = deleteHandleElement.closest('.sortable-list__item');
    item.remove();
  }

  _initDragPosition(event) {
    // set absolute width in order to keep the element  size after
    // removing it from the document flow
    this.draggingElement.style.width =
      `${this.draggingElement.offsetWidth}px`;

    // shift element depending on the initial pointer position
    const rect = this.draggingElement.getBoundingClientRect();
    const shiftX = event.clientX - rect.left;
    const shiftY = event.clientY - rect.top;
    this.draggingElement.style.transform =
      `translate(-${shiftX}px, -${shiftY}px)`;

    this.draggingElement.classList.add('sortable-list__item_dragging');
    this._setDragPosition(event);
  }

  _setDragPosition(event) {
    this.draggingElement.style.left = `${event.clientX}px`;
    this.draggingElement.style.top = `${event.clientY}px`;
  }

  _handleDocumentPointerMove = (event) => {
    this._moveDrag(event);
  }

  _handleElementPointerDown = (event) => {
    const grabHandleElement = event.target.closest('[data-grab-handle]');
    const deleteHandleElement = event.target.closest('[data-delete-handle]');

    if (grabHandleElement) {
      this._startDrag(event, grabHandleElement);
    } else if (deleteHandleElement) {
      this._removeItem(deleteHandleElement);
    } else {
      return;
    }

    event.preventDefault();
  }

  _handleDocumentPointerup = () => {
    this._endDrag();
  }

  _createPlaceholder() {
    this.placeholderElement = document.createElement('li');
    this.placeholderElement.className = 'sortable-list__placeholder sortable-list__item';
    this.draggingElement.after(this.placeholderElement);
  }

  _addEventListeners() {
    this.element.addEventListener('pointerdown', this._handleElementPointerDown);
  }

  _removeEventListeners() {
    this.element.removeEventListener('pointerdown', this._handleElementPointerDown);
    document.removeEventListener("pointermove", this._handleDocumentPointerMove);
    document.removeEventListener("pointerup", this._handleDocumentPointerup);
  }
}
