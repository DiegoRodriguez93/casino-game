const iconMatrix = document.getElementById("icon-matrix") as HTMLDivElement;
const spinButton = document.getElementById("spin-button") as HTMLButtonElement;
const backgroundMusic = document.getElementById(
  "backgroundMusic"
) as HTMLAudioElement;
const spinSound = document.getElementById("spinSound") as HTMLAudioElement;
const spinSound2 = document.getElementById("spinSound2") as HTMLAudioElement;
const smallwin = document.getElementById("smallwin") as HTMLAudioElement;

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
  if (!iconMatrix || !spinButton) {
    return;
  }
  spinButton.disabled = true;

  const rows = 5;
  const cols = 5;
  const delayBetweenColumns = 40;
  const delayBetweenRows = 250;

  for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      ((currentCol, currentRow) => {
        const totalDelay =
          currentCol * delayBetweenColumns +
          (rows - 1 - currentRow) * delayBetweenRows;
        setTimeout(() => {
          const index = currentRow * cols + currentCol;
          const iconElement = iconMatrix.children[index];
          iconElement.classList.add("animate");

          setTimeout(() => {
            // @ts-expect-error
            iconElement.style.backgroundImage = `url(${
              icons[Math.floor(Math.random() * icons.length)]
            })`;
            iconElement.classList.remove("animate");
            iconElement.classList.add("animate-in");

            setTimeout(() => {
              iconElement.classList.remove("animate-in");
              if (col === 4 && row === 2) {
                spinSound.currentTime = 0;
                spinSound.volume = 0.3;
                spinSound.play();
              }
              if (col === 4 && row === 0) {
                console.log("checkForWins()", checkForWins());
                const winningIndices = checkForWins();
                if (winningIndices.length > 0) {
                  handleWin(winningIndices);
                } else {
                  spinButton.disabled = false;
                }
              }
            }, 1550);
          }, 950);
        }, totalDelay);
      })(col, row);
    }
  }
}

if (spinButton) {
  spinButton.addEventListener("click", function () {
    if (!backgroundMusic.paused) {
      backgroundMusic.play().catch((e) => {
        console.error(
          "Error al intentar reproducir la música de fondo automáticamente:",
          e
        );
      });
    }
    spinSound.currentTime = 0;
    spinSound.play();
    spin();
  });
}

function countIcons() {
  const iconMap = new Map();
  for (let i = 0; i < iconMatrix.children.length; i++) {
    const icon = iconMatrix.children[i];
    // @ts-expect-error
    const iconUrl = icon.style.backgroundImage;
    if (!iconMap.has(iconUrl)) {
      iconMap.set(iconUrl, []);
    }
    iconMap.get(iconUrl).push(i);
  }
  return iconMap;
}

function checkForWins() {
  const iconMap = countIcons();
  let winningIndices: Array<Number> = [];
  iconMap.forEach((indices, icon) => {
    if (indices.length >= 5) {
      winningIndices = winningIndices.concat(indices);
    }
  });
  return winningIndices;
}

function handleWin(winningIndices: Array<Number>) {
  smallwin.currentTime = 0;
  smallwin.play();
  winningIndices.forEach((index) => {
    const iconElement = iconMatrix.children[index as any];
    iconElement.classList.add("explode");
    setTimeout(() => {
      iconElement.classList.remove("explode");
      // @ts-expect-error
      iconElement.style.backgroundImage = `url(${
        icons[Math.floor(Math.random() * icons.length)]
      })`;
    }, 1000);
  });

  setTimeout(() => {
    if (checkForWins().length > 0) {
      handleWin(checkForWins());
    } else {
      spinButton.disabled = false;
    }
  }, 1900);
}

createIconMatrix(5, 5);
