let currentSelectedColorClass = null;
let scheduleData = [];

// HTML要素取得
const selectDateInput = document.getElementById('selectDate');
const minutesInput = document.getElementById('minutes');
const generateScheduleButton = document.getElementById('generateSchedule');
const resetScheduleButton = document.getElementById('resetSchedule');
const colorPalette = document.querySelector('.color-palette');
const scheduleGridContainer = document.getElementById('schedule-grid-container')

// イベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    selectDateInput.value = today.toISOString().split('T')[0];

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

function generateGrid() {
    const selectDate = new Date(selectDateInput.value);

    scheduleGridContainer.innerHTML = '';
    const gridSize = 16;

    for (let row = 0; row <= gridSize; row++) {
        for (let col = 0; col <= gridSize; col++) {
            const timeBlockCell = document.createElement('div');
            timeBlockCell.classList.add('grid-cell', 'time-block');

            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('time-block-content');
            contentWrapper.textContent = `${selectDate.getMonth() + 1}/${selectDate.getDate()}`;
            
            timeBlockCell.appendChild(contentWrapper);

            timeBlockCell.dataset.row = row;
            timeBlockCell.dataset.col = col;
            timeBlockCell.dataset.index = row * gridSize + col;
        }
    }
}

function loadGridState() {

}