let capture;
let pg;

function setup() {
  // 建立全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的 HTML 影片元素，我們只在 canvas 內渲染它
  capture.hide();

  // 設定圖片對齊模式為置中，此設定只需在 setup 執行一次
  imageMode(CENTER);

  // 產生與視訊畫面預計顯示尺寸（寬高 60%）相同的繪圖緩衝區
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
}

function draw() {
  // 設定畫布背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 將攝影機影像畫入 pg (維持相同的內容與尺寸)
  // p5.Graphics 預設的 imageMode 是 CORNER，因此我們從左上角 (0,0) 開始畫滿
  pg.image(capture, 0, 0, pg.width, pg.height);

  // --- 在 pg 上進行像素處理 ---
  const stepSize = 20;
  pg.loadPixels();

  // 以 20x20 為單位遍歷 pg 畫布
  for (let y = 0; y < pg.height; y += stepSize) {
    for (let x = 0; x < pg.width; x += stepSize) {
      let totalR = 0, totalG = 0, totalB = 0;
      let pixelCount = 0;

      // 遍歷 20x20 區塊內的每個像素以計算平均顏色
      for (let j = 0; j < stepSize; j++) {
        for (let i = 0; i < stepSize; i++) {
          const px = x + i;
          const py = y + j;
          // 確保像素在畫布範圍內
          if (px < pg.width && py < pg.height) {
            const index = (py * pg.width + px) * 4;
            totalR += pg.pixels[index + 0];
            totalG += pg.pixels[index + 1];
            totalB += pg.pixels[index + 2];
            pixelCount++;
          }
        }
      }

      // 計算平均 RGB 值
      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;

      // 根據平均 RGB 計算亮度 (Brightness)
      const brightness = (avgR + avgG + avgB) / 3;

      // 在 pg 的對應位置上繪製亮度數值
      pg.fill(255); // 白色文字
      pg.noStroke();
      pg.textAlign(CENTER, CENTER);
      pg.textSize(10);
      pg.text(floor(brightness), x + stepSize / 2, y + stepSize / 2);
    }
  }

  // --- 修正攝影機左右顛倒問題 ---
  // 儲存目前的繪圖矩陣狀態
  push();
  // 將原點移動到畫布中央，並水平翻轉 X 軸
  translate(width / 2, height / 2);
  scale(-1, 1);
  
  // 將 pg 產生的圖片顯示在視訊畫面的上方 (Z軸圖層疊加)
  // 由於 pg 已經包含視訊內容並加上了文字，我們只需要繪製 pg 即可
  image(pg, 0, 0, windowWidth * 0.6, windowHeight * 0.6);
  // 還原繪圖矩陣
  pop();
}

// 當視窗大小改變時，重新調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗大小改變時，一併重新更新 pg 的尺寸
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
}