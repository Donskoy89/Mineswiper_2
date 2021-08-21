class Cell{
    constructor(parentElement, y, x, bombCount) {
        this.bombCount = bombCount;

        this.y = y;
        this.x = x;
        this.parentElement = parentElement;
        this.cell = document.createElement('div');
        this.cell.className = 'cell';
        this.cell.style.width = '45px';
        this.cell.style.height = '45px';
        this.parentElement.appendChild(this.cell);

        this.value = Math.random() < this.bombCount ? 0 : 'B';
        this.cell.dataset.y = y;
        this.cell.dataset.x = x;
        this.cell.dataset.checked = false;
        this.cell.dataset.flag = false;
        this.cell.innerHTML = this.value ? this.value : '';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.cell.dataset.value = value;
    }

}