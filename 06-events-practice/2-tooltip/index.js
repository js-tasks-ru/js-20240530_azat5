const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

export default class Tooltip {
  static instance;
  static tooltipElementOffset = { x: 10, y: 0 };

  constructor() {
    if (Tooltip.instance) { return Tooltip.instance; }
    Tooltip.instance = this;
  }

  initialize() {
    this.element = Helpers.createElementFromTemplate(this._createTemplate());

    document.body.addEventListener("pointerover", this._handleDocumentPointerover);
    document.body.addEventListener("pointerout", this._handleDocumentPointerout);
  }

  destroy() {
    document.body.removeEventListener("pointerover", this._handleDocumentPointerover);
    document.body.removeEventListener("pointerout", this._handleDocumentPointerout);
    this.element.remove();
  }

  render(message) {
    this.element.textContent = message;
    document.body.append(this.element);
  }

  _handleDocumentPointerover = (e) => {
    const targetElement = e.target.closest("[data-tooltip]");
    if (!targetElement) { return; }

    document.body.addEventListener("pointermove", this._handleDocumentPointermove);
    this.render(targetElement.dataset.tooltip);
  }

  _handleDocumentPointermove = (e) => {
    this.element.style.left = `${e.clientX + Tooltip.tooltipElementOffset.x}px`;
    this.element.style.top = `${e.clientY + Tooltip.tooltipElementOffset.y}px`;
  }

  _handleDocumentPointerout = (e) => {
    const targetElement = e.target.closest("[data-tooltip]");
    if (!targetElement) { return; }

    document.body.removeEventListener("pointermove", this._handleDocumentPointermove);
    this.element.remove();
  }

  _createTemplate() {
    return `
      <div class="tooltip">
        ${this.message}
      </div>
    `;
  }
}
