class Game {
    constructor(parenElement, width, height, bombsPercent) {
        this.start = false;
        this.timerId = null;
        this.sec = 0;
        this.min = 0;

        document.querySelector('#record').innerHTML = window.localStorage.getItem('bestTime') != undefined ? Math.floor(window.localStorage.getItem('bestTime')/60) + ' : ' + window.localStorage.getItem('bestTime')%60 : '0 : 0';

        this.parenElement = parenElement;
        this.width = width;
        this.height = height;
        this.bombsPercent = bombsPercent;

        this.cells = [];
        this.bombs = [];

        this.playfield = document.createElement('div');
        this.playfield.style.width = (this.width*45) + 'px';
        this.playfield.style.height = (this.height*45) + 'px';
        this.playfield.className = 'playfield';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let newCell = new Cell(this.playfield, y, x, (100 - this.bombsPercent)*0.01);
                this.cells.push(newCell);
                if(newCell.value == 'B') {
                    this.bombs.push(newCell);
                    newCell.cell.style.zIndex = '2';
                }
            }
        }

        this.parenElement.appendChild(this.playfield);

        this.drawNumbers();

        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].cell.addEventListener('click', this.checkCell.bind(this));
            this.cells[i].cell.addEventListener('contextmenu', this.standFlag.bind(this));
        }
        
        this.bombCount = this.bombs.length;
        this.bombViewElement = document.getElementById('bombCount');
        this.bombViewElement.innerHTML = this.bombCount;
    }

    // Таймер
    startTimer() {
        if(this.start) {
            return
        }

        this.timerId = setInterval(() => {
            this.sec++;
            if(this.sec > 60) {
                this.min++;
                this.sec = 0;
            }
            document.querySelector('#sec').innerHTML = this.sec;
            document.querySelector('#min').innerHTML = this.min;
        }, 1000);
    }


    // Расстановка цифр по полю
    drawNumbers() {
        for (let i = 0; i < this.cells.length; i++) {

            if (this.cells[i].value !== "B") {
                let count = 0;
                let x = this.cells[i].x;
                let y = this.cells[i].y;

                if (
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${y}"]`) != undefined &&
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${y}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${x - 1}"][data-y="${y}"]`) != undefined &&
                    document.querySelector(`[data-x="${x - 1}"][data-y="${y}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${x}"][data-y="${+y + 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${x}"][data-y="${+y + 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${x}"][data-y="${y - 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${x}"][data-y="${y - 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${y - 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${y - 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${+y + 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${+x + 1}"][data-y="${+y + 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${x - 1}"][data-y="${+y + 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${x - 1}"][data-y="${+y + 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }

                if (
                    document.querySelector(`[data-x="${x - 1}"][data-y="${y - 1}"]`) != undefined &&
                    document.querySelector(`[data-x="${x - 1}"][data-y="${y - 1}"]`).dataset.value == "B"
                ) {
                    count++;
                }
                this.cells[i].value = count;
                this.cells[i].cell.innerHTML = count > 0 ? count : '';

                switch(this.cells[i].value) {
                    case 1:
                        this.cells[i].cell.style.color = 'green';
                        this.cells[i].cell.style.textShadow = '0 0 5px #08ff08';
                        break;
                    case 2: 
                        this.cells[i].cell.style.color = '#8d8d00';
                        this.cells[i].cell.style.textShadow = '0 0 5px #ffff01';
                        break; 
                    case 3: 
                        this.cells[i].cell.style.color = '#815401';
                        this.cells[i].cell.style.textShadow = '0 0 5px #ffa600';
                        break;
                    case 4: 
                        this.cells[i].cell.style.color = '#b60000';
                        this.cells[i].cell.style.textShadow = '0 0 5px #ff0000';
                        break;
                    case 5: 
                        this.cells[i].cell.style.color = '#5a0000';
                        this.cells[i].cell.style.textShadow = '0 0 5px #b32020';
                        break;
                    case 6: 
                        this.cells[i].cell.style.color = '#440044';
                        this.cells[i].cell.style.textShadow = '0 0 5px #ff00ff';
                        break;
                    case 7: 
                        this.cells[i].cell.style.color = 'black';
                        this.cells[i].cell.style.textShadow = '0 0 5px black';
                        break;
                    case 8: 
                        this.cells[i].cell.style.color = '#007272';
                        this.cells[i].cell.style.textShadow = '0 0 5px #00ffff';
                        break;
                }
            }
        }
    }

    // Установка флажка
    standFlag(event) {
        event.preventDefault();

        if(!event.target.classList.contains('unhide')) {
            event.target.dataset.flag = event.target.dataset.flag == 'false' ? 'true' : 'false';

            event.target.classList.toggle('marked-cell');

            event.target.dataset.flag == 'true' ? this.bombCount-- : this.bombCount++;
            this.bombViewElement.innerHTML = this.bombCount;

            this.checkPlayfield();
        }
        
    }

    // логика выигрыша
    checkPlayfield() {
        let countFlags = 0;
        let countOpenCells = 0;

        for (let i = 0; i < this.bombs.length; i++) {
            if(this.bombs[i].cell.dataset.flag == 'true') {
                countFlags++;
            }            
        }

        for (let i = 0; i < this.cells.length; i++) {
            if(this.cells[i].cell.dataset.checked == 'true') {
                countOpenCells++;
            }            
        }

        if(countFlags == this.bombs.length || countOpenCells == this.cells.length - this.bombs.length) {
            clearInterval(this.timerId);

            let bestTime = +(this.min*60) + this.sec;

            if(+window.localStorage.getItem('bestTime') > +bestTime || window.localStorage.getItem('bestTime') == undefined) {
                window.localStorage.setItem('bestTime', bestTime);
            }
           
           document.querySelector('#record').innerHTML = Math.floor(window.localStorage.getItem('bestTime')/60)+ ' : ' + window.localStorage.getItem('bestTime')%60;

            // alert('You Win!');
            this.winnerScreen();
        }
    }

    // Проверка ячейки по клику
    checkCell(event) {
        
        const cell = event.target;
        const value = event.target.dataset.value;

        cell.dataset.checked = true;
        if (cell.dataset.flag === 'true') {
            return;
        } else if (value === 'B') {
            this.expl();
        } else if (value === '0') {
            this.openEmptyCells(cell);
        } else {
            cell.classList.add('unhide');
        }

        this.startTimer();
        this.start = true;

        this.checkPlayfield();
    }

    // Взрыв, конец игры
    expl() {
        this.start = true;
        clearInterval(this.timerId);
        
        let timer = 0;
        let timer2 = 0;

        for (let i = 0; i < this.bombs.length; i++) {
            setTimeout(() => {
                this.bombs[i].cell.classList.add('animated');
                this.bombs[i].cell.innerHTML = '<img class="bomb" src="src/img/bomb.png">';
                
            }, timer);
            timer += 50;
        }
        for (let i = 0; i < this.bombs.length; i++) {
            setTimeout(() => {
                this.bombs[i].cell.innerHTML = '<img class="bomb" src="src/img/bomb-2.png">';
            }, 2000+ timer2);
            timer2 += 50;
        }
        setTimeout(() => {
            this.playfield.style.width = '0';
            this.playfield.style.height = '0';
            this.playfield.style.outline = 'none';
        }, timer+3100);
    }

    // Исчезновение пустых ячеек
    openEmptyCells(emptyCell) {
        emptyCell.classList.add('unhide');
        emptyCell.dataset.checked = 'true';

        let x = emptyCell.dataset.x;
        let y = emptyCell.dataset.y;

        this.openCellsDirection(+x+1, y);
        this.openCellsDirection(x-1, y);
        this.openCellsDirection(x, +y+1);
        this.openCellsDirection(x, y-1);
        this.openCellsDirection(+x+1, y-1);
        this.openCellsDirection(+x+1, +y+1);
        this.openCellsDirection(x-1, +y+1);
        this.openCellsDirection(x-1, y-1);
    }

    openCellsDirection(x, y) {
        if (document.querySelector(`[data-x="${x}"][data-y="${y}"]`) != undefined) {
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add('unhide');

            if (document.querySelector(`[data-x="${x}"][data-y="${y}"]`).dataset.value === '0' && document.querySelector(`[data-x="${x}"][data-y="${y}"]`).dataset.checked === 'false') {
                this.openEmptyCells(document.querySelector(`[data-x="${x}"][data-y="${y}"]`));
            } else {
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).dataset.checked = 'true';
            }
        }
    }

    winnerScreen() {
        document.querySelector('.modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        document.querySelector('#win-time').innerHTML = this.min + ' min ' + this.sec + ' sec';
    }
}