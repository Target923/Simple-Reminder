let currentSelectedColorClass = null;

// HTML要素取得
// const minutesInput = document.getElementById('minutes');
const generateGridButton = document.getElementById('generateGrid');
const resetGridButton = document.getElementById('resetGrid');
const colorPalette = document.querySelector('.color-palette');
const scheduleGridContainer = document.getElementById('schedule-grid-container')

// イベントリスナー
generateGridButton.addEventListener('click', () => {
    colorPalette.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.colorClass) {
            currentSelectedColorClass = event.target.dataset.colorClass;
            console.log(`選択された色: ${currentSelectedColorClass}`);
            // 追加ロジック
        }
    });

    generateGrid();
    loadGridState();
});

resetGridButton.addEventListener('click', () => {
    localStorage.removeItem('gridColors');
    generateGrid();
    console.log('学習表の状態をリセットしました');
});

function generateGrid() {
    scheduleGridContainer.innerHTML = '';
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

                    clickedBlock.classList.add(currentSelectedColorClass);

                    saveGridState(clickedBlock.dataset.index, currentSelectedColorClass);
                    console.log(`セル ${clickedBlock.dataset.index} に色 ${currentSelectedColorClass} を保存しました。`);
                    
                    const selectDateInput = document.getElementById('selectDate');
                    const selectDate = new Date(selectDateInput.value);
                    contentWrapper.textContent = `${selectDate.getMonth() + 1}/${selectDate.getDate()}`;
                }
            });

            scheduleGridContainer.appendChild(timeBlockCell);
        }
    }
}

/**
 * セルの状態を保存する関数
 * @param {number} index - セルのインデックス
 * @param {string} colorClass - セルに適用する色のクラス
 */

function saveGridState(index, colorClass) {
    let savedState = JSON.parse(localStorage.getItem('gridColors')) || {};
    savedState[index] = colorClass;
    localStorage.setItem('gridColors', JSON.stringify(savedState));
}

function loadGridState() {
    const savedState = JSON.parse(localStorage.getItem('gridColors'));
    if (savedState) {
        Object.entries(savedState).forEach(([index, colorClass]) => {
            const cell = scheduleGridContainer.querySelector(`[data-index="${index}"]`);
            if (cell) {
                cell.classList.add(colorClass);
            }
        });
    }
}