const Helpers = {
  createElementFromTemplate(template) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    return tempDiv.firstElementChild;
  }
};

const defaultFormatValue = (v) => v;

export default class DoubleSlider {
  currentDragElement;
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
    this.formatValue = formatValue;
    this.from = selected.from;
    this.to = selected.to;
    this.element = Helpers.createElementFromTemplate(this._createTemplate());
    this.sliderInner = this.element.querySelector(".range-slider__inner");
    this.thumbLeftElement = this.element.querySelector(".range-slider__thumb-left");
    this.thumbRightElement = this.element.querySelector(".range-slider__thumb-right");
    this.progressElement = this.element.querySelector(".range-slider__progress");
    this.element.addEventListener("pointerdown", this._handlePointerDownOnLeftThumb);
    this.element.addEventListener("pointerdown", this._handlePointerDownOnRightThumb);
  }

  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDownOnLeftThumb);
    this.element.removeEventListener("pointerdown", this._handlePointerDownOnRightThumb);
    this.element.remove();
  }

  _handlePointerDownOnLeftThumb = (e) => {
    const targetElement = e.target.closest(".range-slider__thumb-left");
    if (!targetElement) { return; }

    document.addEventListener("pointermove", this._handlePointerMoveOnLeftThumb);
    document.addEventListener("pointerup", this._handlePointerUpOnLeftThumb);
  }

  _handlePointerMoveOnLeftThumb = (e) => {
    const containerWidth = this.sliderInner.getBoundingClientRect().width;
    const containerLeftAbs = this.sliderInner.offsetLeft;
    const pointerLeftAbs = e.clientX;
    const pointerLeftRel = pointerLeftAbs - containerLeftAbs;
    const selected = Math.round(pointerLeftRel / containerWidth * (this.max - this.min)) + this.min;

    this.from = [this.min, selected, this.to].sort((a, b) => a - b)[1];
    let leftPercent = (this.from - this.min) / (this.max - this.min) * 100;
    this.thumbLeftElement.style.left = `${leftPercent}%`;

    this._updateValues();
  }

  _handlePointerUpOnLeftThumb = (_e) => {
    this._dispatchEvent();
    document.removeEventListener("pointerup", this._handlePointerUpOnLeftThumb);
    document.removeEventListener("pointermove", this._handlePointerMoveOnLeftThumb);
  }

  _handlePointerDownOnRightThumb = (e) => {
    const targetElement = e.target.closest(".range-slider__thumb-right");
    if (!targetElement) { return; }

    document.addEventListener("pointermove", this._handlePointerMoveOnRightThumb);
    document.addEventListener("pointerup", this._handlePointerUpOnRightThumb);
  }

  _handlePointerMoveOnRightThumb = (e) => {
    const containerWidth = this.sliderInner.getBoundingClientRect().width;
    const containerLeftAbs = this.sliderInner.offsetLeft;
    const pointerLeftAbs = e.clientX;
    const pointerLeftRel = pointerLeftAbs - containerLeftAbs;
    const selected = Math.round(pointerLeftRel / containerWidth * (this.max - this.min)) + this.min;

    this.to = [this.max, selected, this.from].sort((a, b) => a - b)[1];
    let rightPercent = (this.max - this.to) / (this.max - this.min) * 100;
    this.thumbRightElement.style.right = `${rightPercent}%`;

    this._updateValues();
  }

  _handlePointerUpOnRightThumb = (_e) => {
    this._dispatchEvent();
    document.removeEventListener("pointerup", this._handlePointerUpOnRightThumb);
    document.removeEventListener("pointermove", this._handlePointerMoveOnRightThumb);
  }

  _updateValues() {
    this.progressElement.style.left = `${(this.from - this.min) / (this.max - this.min) * 100}%`;
    this.progressElement.style.right = `${(this.max - this.to) / (this.max - this.min) * 100}%`;
    this.element.querySelector("[data-element=from]").textContent = this.formatValue(this.from);
    this.element.querySelector("[data-element=to]").textContent = this.formatValue(this.to);
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
