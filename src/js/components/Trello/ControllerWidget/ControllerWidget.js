export default class ControllerWidget {
  constructor(widget, data) {
    this.widget = widget;
    this.data = data;
    this.draggedEl = null;
    this.ghostEl = null;
    this.prevouseIndex = null;
    this.prevouseObject = null;
    this.currentIndex = null;
    this.currentObject = null;

    if (localStorage.getItem('dataWidget') === null) {
      this.updateLocalStorage();
    } else {
      this.data = JSON.parse(localStorage.getItem('dataWidget'));
    }

    this.init();
  }

  init() {
    this.widget.drawWidget(this.data);
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('click', (event) => {
      if (event.target.closest('.delete-item')) {
        this.deleteItem(event.target.closest('.task-item'));
      }
      if (event.target.closest('.add-block')) {
        this.toggleAddBlock(event.target.closest('.add-block'));
      }
      if (event.target.closest('.button-submit')) {
        const textArea = event.target.closest('.add-field').querySelector('.textarea-add');
        const column = event.target.closest('.block-task-list').querySelector('.title-task-list');
        this.addItem(column.textContent, textArea.value);
        textArea.value = '';
        this.resetTextArea(event.target.closest('.button-submit'));
      }
      if (event.target.closest('.button-cancel')) {
        this.resetTextArea(event.target.closest('.button-cancel'));
      }
    });

    document.addEventListener('mousedown', (event) => {
      // event.preventDefault();
      if (event.target.closest('.delete-item')) {
        return;
      }
      if (event.target.closest('.task-item')) {
        this.draggedEl = event.target.closest('.task-item');
        this.ghostEl = this.draggedEl.cloneNode(true);
        this.ghostEl.classList.add('dragged');
        this.prevouseIndex = this.getElementPosition();
        this.prevouseObject = this.getElementObject();

        document.body.appendChild(this.ghostEl);
        this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
        this.ghostEl.style.left = `${event.pageX - this.ghostEl.offsetWidth / 2}px`;
        this.ghostEl.style.top = `${event.pageY - this.ghostEl.offsetHeight / 2}px`;
      }
    });

    document.addEventListener('mousemove', (event) => {
      event.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.style.left = `${event.pageX - this.ghostEl.offsetWidth / 2}px`;
      this.ghostEl.style.top = `${event.pageY - this.ghostEl.offsetHeight / 2}px`;
    });

    document.addEventListener('mouseleave', (event) => {
      event.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      document.body.removeChild(this.ghostEl);
      this.ghostEl = null;
      this.draggedEl = null;
    });

    document.addEventListener('mouseup', (event) => {
      event.preventDefault();
      if (event.target.closest('.delete-item')) {
        return;
      }
      if (!this.draggedEl) {
        return;
      }

      const closest = this.getNearestElement(event);

      if (closest) {
        const { top, height } = closest.getBoundingClientRect();
        const toTop = event.clientY - top;
        const toBottom = height + top - event.clientY;
        if (toTop > toBottom) {
          closest.parentElement.insertBefore(this.draggedEl, closest.nextElementSibling);
        } else {
          closest.parentElement.insertBefore(this.draggedEl, closest);
        }
        this.redrawData();
      } else {
        const blockTaskList = document.elementFromPoint(event.clientX, event.clientY);
        if (blockTaskList) {
          const listItem = blockTaskList.closest('.block-task-list').querySelector('.list-block');
          listItem.appendChild(this.draggedEl);
          this.redrawData();
        }
      }

      document.body.removeChild(this.ghostEl);
      this.ghostEl = null;
      this.draggedEl = null;
      this.prevouseIndex = null;
      this.prevouseObject = null;
      this.currentIndex = null;
      this.currentObject = null;
      this.updateLocalStorage();
    });
  }

  getNearestElement(event) {
    let temporaryValue = null;
    if (!document.elementFromPoint(event.clientX, event.clientY)) {
      return null;
    }

    temporaryValue = document.elementFromPoint(event.clientX, event.clientY).closest('.task-item');
    if (!temporaryValue) {
      temporaryValue = document.elementFromPoint(event.clientX, event.clientY - 10).closest('.task-item');
    }
    if (!temporaryValue) {
      temporaryValue = document.elementFromPoint(event.clientX, event.clientY + 10).closest('.task-item');
    }
    if (!temporaryValue) {
      temporaryValue = document.elementFromPoint(event.clientX, event.clientY - 10).closest('.task-item');
    }
    return temporaryValue || null;
  }

  updateLocalStorage() {
    localStorage.setItem('dataWidget', JSON.stringify(this.data));
    this.data = JSON.parse(localStorage.getItem('dataWidget'));
    this.widget.drawWidget(this.data);
  }

  resetTextArea(element) {
    const textArea = element.closest('.add-field').querySelector('.textarea-add');
    textArea.value = '';
    this.toggleAddBlock(element);
  }

  toggleAddBlock(element) {
    const blockAddTtem = element.closest('.block-add-item');
    const blockAddField = blockAddTtem.querySelector('.add-field');
    const blockAddBlock = blockAddTtem.querySelector('.add-block');
    if (blockAddField.classList.contains('disabled')) {
      blockAddField.classList.remove('disabled');
      blockAddBlock.classList.add('disabled');
    } else {
      blockAddField.classList.add('disabled');
      blockAddBlock.classList.remove('disabled');
    }
  }

  deleteItem(element) {
    const deleteBlock = element;
    const parentitemBlock = deleteBlock.closest('.list-block');
    const arrayItems = [...parentitemBlock.querySelectorAll('.task-item')];
    const index = arrayItems.findIndex((item) => item === deleteBlock);
    const column = parentitemBlock.closest('.block-task-list').querySelector('.title-task-list');
    const dataCol = this.data.find((item) => item.title === column.textContent);
    dataCol.data.splice(index, 1);
    this.updateLocalStorage();
  }

  getElementPosition() {
    const elements = [...this.draggedEl.closest('.list-block').querySelectorAll('.task-item')];
    return elements.findIndex((item) => item === this.draggedEl);
  }

  getElementObject() {
    const column = this.draggedEl.closest('.block-task-list').querySelector('.title-task-list');
    return this.data.find((item) => item.title === column.textContent);
  }

  redrawData() {
    this.currentIndex = this.getElementPosition();
    this.currentObject = this.getElementObject();
    const draggedObject = this.prevouseObject.data.splice(this.prevouseIndex, 1);
    this.currentObject.data.splice(this.currentIndex, 0, draggedObject[0]);
  }

  addItem(column, content) {
    const newObject = {
      img: null,
      text: null,
      icons: [
        {
          name: 'like',
          value: null,
        },
        {
          name: 'list',
          value: null,
        },
        {
          name: 'chat',
          value: null,
        },
        {
          name: 'check',
          value: {
            count: null,
            result: null,
          },
        },
      ],
    };
    newObject.text = content;
    const dataCol = this.data.find((item) => item.title === column);
    dataCol.data.push(newObject);
    this.updateLocalStorage();
  }
}
