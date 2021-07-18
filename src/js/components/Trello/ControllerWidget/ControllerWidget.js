export default class ControllerWidget {
  constructor(widget, data) {
    this.widget = widget;
    this.data = data;

    if (localStorage.getItem('dataWidget') === null) {
      localStorage.setItem('dataWidget', JSON.stringify(this.data));
    } else {
      this.data = JSON.parse(localStorage.getItem('dataWidget'));
    };

    this.init();
  }

  init() {
    this.widget.drawWidget(this.data);
  }

  parserDataDom() {
    
  }

  
}