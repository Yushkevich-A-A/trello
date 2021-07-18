import './DrawWidget/DrawWidget.css';
import './ControllerWidget/ControllerWidget.css';

import ControllerWidget from './ControllerWidget/ControllerWidget';
import DrawWidget from './DrawWidget/DrawWidget.js';
import data from './data/data';

const widget = new DrawWidget();
const dataInitial = data;
const controller = new ControllerWidget(widget, dataInitial);