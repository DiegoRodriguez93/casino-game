const iconMatrix = document.getElementById("icon-matrix");
const spinButton = document.getElementById("spin-button");
const icons = [
  "src/icons/apple.png",
  "src/icons/banana.png",
  "src/icons/blue-apple.png",
  "src/icons/blue-diamond.png",
  "src/icons/green-diamond.png",
  "src/icons/multi-color-diamond.png",
  "src/icons/multi-color-uva.png",
  "src/icons/red-diamond.png",
  "src/icons/sandia.png",
  "src/icons/uva.png",
];

function createIcon(): HTMLElement {
  const icon = document.createElement("div");
  icon.className = "icon";
  icon.style.backgroundImage = `url(${
    icons[Math.floor(Math.random() * icons.length)]
  })`;
  return icon;
}

function createIconMatrix(rows: number, cols: number): void {
  if (!iconMatrix) {
    return;
  }
  iconMatrix.innerHTML = "";
  for (let i = 0; i < rows * cols; i++) {
    iconMatrix.appendChild(createIcon());
  }
}

function spin(): void {
    if (!iconMatrix) {
      return;
    }
    const rows = 5;
    const cols = 5;
    const delayBetweenColumns = 50;
    const delayBetweenRows = 300;
  
    for (let row = rows - 1; row >= 0; row--) {
      for (let col = 0; col < cols; col++) {
        ((currentCol, currentRow) => {
          const totalDelay = currentCol * delayBetweenColumns + (rows - 1 - currentRow) * delayBetweenRows;
          setTimeout(() => {
            const index = currentRow * cols + currentCol;
            const iconElement = iconMatrix.children[index];
            iconElement.classList.add("animate");
  
            setTimeout(() => {
              // @ts-expect-error
              iconElement.style.backgroundImage = `url(${icons[Math.floor(Math.random() * icons.length)]})`;
              iconElement.classList.remove("animate");
              iconElement.classList.add("animate-in");
  
              setTimeout(() => {
                iconElement.classList.remove("animate-in");
              }, 100);
            }, 1000);
          }, totalDelay);
        })(col, row);
      }
    }
  }
  
  

if (spinButton) {
  spinButton.addEventListener("click", spin);
}

createIconMatrix(5, 5);
