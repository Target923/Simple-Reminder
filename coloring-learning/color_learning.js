let currentSelectedColorClass = null;
let previewSelected = null;

// HTML要素取得
// const minutesInput = document.getElementById('minutes');
const generateGridButton = document.getElementById('generateGrid');
const resetGridButton = document.getElementById('resetGrid');
const colorPalette = document.querySelector('.color-palette');
const gridContainer = document.getElementById('grid-container')

// イベントリスナー
generateGridButton.addEventListener('click', () => {
    colorPalette.addEventListener('click', (event) => {
        const currentSelected = event.target;
        if (event.target.tagName === 'BUTTON' && event.target.dataset.colorClass) {
            currentSelectedColorClass = event.target.dataset.colorClass;
            console.log(`選択された色: ${currentSelectedColorClass}`);
            
            if (previewSelected) {
                previewSelected.classList.remove('selected-color');
            }
            currentSelected.classList.add('selected-color');
            previewSelected = currentSelected;
        }
    });

    generateGrid();
    loadGridState();
});

resetGridButton.addEventListener('click', () => {
    const hasGrid = gridContainer.childElementCount > 0;
    if (hasGrid) {
        resetGrid();
    }
});

function generateGrid() {
    gridContainer.innerHTML = '';
    const gridSize = 16;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const timeBlockCell = document.createElement('div');
            timeBlockCell.classList.add('grid-cell');

            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('time-block-content');
            
            timeBlockCell.appendChild(contentWrapper);

            timeBlockCell.dataset.row = row;
            timeBlockCell.dataset.col = col;
            timeBlockCell.dataset.index = row * gridSize + col;

            timeBlockCell.addEventListener('click', (event) => {
                const clickedBlock = event.currentTarget;
                if (currentSelectedColorClass) {
                    clickedBlock.classList.forEach(cls => {
                        if (cls.startsWith('color-')) {
                            clickedBlock.classList.remove(cls);
                        }
                    });
                    clickedBlock.classList.add(currentSelectedColorClass)

                    const selectDateInput = document.getElementById('selectDate');
                    const selectDate = new Date(selectDateInput.value);
                    if (selectDate.getTime()) {
                        contentWrapper.textContent = `${selectDate.getMonth() + 1}/${selectDate.getDate()}`;
                    } else {
                        contentWrapper.textContent = '';
                    }

                    const cellData = {
                        color: currentSelectedColorClass,
                        date: contentWrapper.textContent,
                    }
                    saveGridState(clickedBlock.dataset.index, cellData);
                    console.log(`セル ${clickedBlock.dataset.index} に色 ${currentSelectedColorClass} を保存しました。`);}
            });

            gridContainer.appendChild(timeBlockCell);
        }
    }
}

function resetGrid() {
    localStorage.removeItem('gridColors');
    generateGrid();
    console.log('学習表の状態をリセットしました');
}

/**
 * セルの状態を保存する関数
 * @param {number} index - セルのインデックス
 * @param {string} colorClass - セルに適用する色のクラス
 */

function saveGridState(index, cellData) {
    let savedState = JSON.parse(localStorage.getItem('gridColors')) || {};
    savedState[index] = cellData;
    localStorage.setItem('gridColors', JSON.stringify(savedState));
}

function loadGridState() {
    const savedState = JSON.parse(localStorage.getItem('gridColors'));
    if (savedState) {
        Object.entries(savedState).forEach(([index, cellData]) => {
            const cell = gridContainer.querySelector(`[data-index="${index}"]`);
            if (cell && cellData && typeof cellData === 'object') {
                if (cellData.color) {
                    cell.classList.add(cellData.color);
                }
                if (cellData.date && cell.querySelector('.time-block-content')) {
                    cell.querySelector('.time-block-content').textContent = cellData.date;
                }
            }
        });
    }
}