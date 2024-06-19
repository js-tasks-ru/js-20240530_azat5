export default class NotificationMessage {
  static prevInstance;
  static clearPrevInstance(currentInstance) {
    if (NotificationMessage.prevInstance) {
      NotificationMessage.prevInstance.destroy();
    }

    NotificationMessage.prevInstance = currentInstance;
  }

  constructor(message, {duration = 2000, type = "success"} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this._createElement();
  }

  show(element = document.body) {
    NotificationMessage.clearPrevInstance(this);

    element.appendChild(this.element);
    this.timer = setTimeout(() => this.remove(), this.duration);
  }

  destroy() {
    clearTimeout(this.timer);
    this.element.remove();
  }

  _createElement() {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = this._createTemplate();
    return tempDiv.firstElementChild;
  }

  _createTemplate() {
    return `
      <div class="${this._createHtmlClasses()}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;
  }

  _createHtmlClasses() {
    let classes = ["notification"];
    let typeClass;

    switch (this.type) {
    case "success":
      typeClass = "success";
      break;
    case "error":
      typeClass = "error";
      break;
    }

    classes.push(typeClass);

    return classes.join(" ");
  }

  remove() {
    this.element.remove();
  }
}
