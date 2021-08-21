const root = document.querySelector('#root');

document.getElementById('startGame').onclick = startGame;

document.querySelector('#resetGame').onclick = () => {
    window.location.reload();
}

function startGame(event) {
    event.preventDefault();
    const cols = document.getElementById('cols').value;
    const rows = document.getElementById('rows').value;
    const bombs = document.getElementById('bombs').value;

    if(+cols > 0 && +rows > 0 && bombs > 0) {
        const game = new Game(root, cols, rows, bombs);
        document.querySelector('.start_menu').classList.add('start-remove');
    }
}
