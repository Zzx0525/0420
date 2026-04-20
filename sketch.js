let capture;

function setup() {
  // 建立全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的 HTML 影片元素，我們只在 canvas 內渲染它
  capture.hide();
}

function draw() {
  // 設定畫布背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 設定圖片對齊模式為置中
  imageMode(CENTER);
  
  // 將影像繪製在視窗正中間，寬高設定為全螢幕畫面寬高的 60%
  image(capture, windowWidth / 2, windowHeight / 2, windowWidth * 0.6, windowHeight * 0.6);
}

// 當視窗大小改變時，重新調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}