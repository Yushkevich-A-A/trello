import ControllerWidget from './ControllerWidget/ControllerWidget';
import './DrawWidget/DrawWidget.css';
import DrawWidget from './DrawWidget/DrawWidget.js';

const widget = new DrawWidget();
const data = [{title:'Todo', data: [
  {
    img: null,
    text: 'Welcome to trello',
    icons: [
      {
        name: 'like',
        value: 1,
      },
      {
        name: 'list',
        value: null
      },
      {
        name: 'chat',
        value: 1,
      },
      {
        name: 'check',
        value: {
          count: 1,
          result: 0,
        }
      },
    ]
  },
  {
    img: {
      src:'test.jpg',
      alt: 'милота',
    },
    text: null,
    icons: null,
  },
]},{title:'In porgess', data: []},{title:'Done', data: []},];

const controller = new ControllerWidget(widget, data);