const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

export default class Tooltip {
  static instance;
  static showEventName = "pointerover";
  static hideEventName = "pointerout";

  constructor() {
    if (Tooltip.instance) { return Tooltip.instance; }
    Tooltip.instance = this;
  }

  initialize() {
    this.element = Helpers.createElementFromTemplate(this._createTemplate());

    document.body.addEventListener(Tooltip.showEventName, this._handleShow);
    document.body.addEventListener(Tooltip.hideEventName, this._handleHide);
  }

  destroy() {
    document.body.removeEventListener(Tooltip.showEventName, this._handleShow);
    document.body.removeEventListener(Tooltip.hideEventName, this._handleHide);
    this.element.remove();
  }

  render(message) {
    this.element.textContent = message;
    document.body.append(this.element);
  }

  _handleShow = (e) => {
    const targetElement = e.target.closest("[data-tooltip]");
    if (!targetElement) { return; }

    const message = targetElement.dataset.tooltip;
    this.element.textContent = message;

    targetElement.append(this.element);
  }

  _handleHide = (e) => {
    const targetElement = e.target.closest("[data-tooltip]");
    if (!targetElement) { return; }

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
