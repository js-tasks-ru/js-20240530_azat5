const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

const defaultFormatValue = (v) => v;

export default class DoubleSlider {
  constructor(
    {
      min = 0,
      max = 100,
      formatValue = defaultFormatValue,
      selected = { from: min, to: max }
    } = {}
  ) {
    this.min = min;
    this.max = max;
    this.from = selected.from;
    this.to = selected.to;
    this.formatValue = formatValue;
    this.range = this.max - this.min;
    this.element = Helpers.createElementFromTemplate(this._createTemplate());
    this.sliderInner = this.element.querySelector(".range-slider__inner");
    this.thumbLeftElement = this.element.querySelector(".range-slider__thumb-left");
    this.thumbRightElement = this.element.querySelector(".range-slider__thumb-right");
    this.progressElement = this.element.querySelector(".range-slider__progress");
    this.fromElement = this.element.querySelector("[data-element=from]");
    this.toElement = this.element.querySelector("[data-element=to]");
    this.element.addEventListener("pointerdown", this._handleElementPointerdown);
  }

  destroy() {
    this.element.removeEventListener("pointerdown", this._handleElementPointerdown);
    this.element.remove();
  }

  _handleElementPointerdown = (e) => {
    switch (e.target) {
    case this.thumbLeftElement:
      this.draggable = "left";
      break;
    case this.thumbRightElement:
      this.draggable = "right";
      break;
    default:
      return;
    }

    document.addEventListener("pointermove", this._handleDocumentPointermove);
    document.addEventListener("pointerup", this._handleDocumentPointerup);
  }

  _handleDocumentPointermove = (e) => {
    switch (this.draggable) {
    case "left":
      this.from =
        [this.min, this._calculateSelectedValue(e), this.to]
        .sort((a, b) => a - b)[1];
      break;
    case "right":
      this.to =
        [this.from, this._calculateSelectedValue(e), this.max]
        .sort((a, b) => a - b)[1];
      break;
    default:
      return;
    }

    this._updateStylesAndLabels();
  }

  _handleDocumentPointerup = (_e) => {
    this._dispatchEvent();
    document.removeEventListener("pointerup", this._handleDocumentPointerup);
    document.removeEventListener("pointermove", this._handleDocumentPointermove);
  }

  _calculateSelectedValue(moveEvent) {
    const containerWidth = this.sliderInner.getBoundingClientRect().width;
    const containerLeftAbs = this.sliderInner.offsetLeft;
    const pointerLeftAbs = moveEvent.clientX;
    const pointerLeftRel = pointerLeftAbs - containerLeftAbs;
    return Math.round(pointerLeftRel / containerWidth * this.range) + this.min;
  }

  _updateStylesAndLabels() {
    const leftPosition = `${(this.from - this.min) / this.range * 100}%`;
    const rightPosition = `${(this.max - this.to) / this.range * 100}%`;

    this.thumbLeftElement.style.left = leftPosition;
    this.thumbRightElement.style.right = rightPosition;

    this.progressElement.style.left = leftPosition;
    this.progressElement.style.right = rightPosition;

    this.fromElement.textContent = this.formatValue(this.from);
    this.toElement.textContent = this.formatValue(this.to);
  }

  _dispatchEvent() {
    this.element.dispatchEvent(new CustomEvent("range-select", {
      detail: { from: this.from, to: this.to }
    }));
  }

  _createTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress"></span>
          <span class="range-slider__thumb-left" style="left: 0%"></span>
          <span class="range-slider__thumb-right" style="right: 0%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>
    `;
  }
}
