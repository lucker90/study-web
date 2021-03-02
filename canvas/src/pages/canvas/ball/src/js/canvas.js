export class Canvas {
  constructor(domId, width, height) {
    const draw = document.getElementById(domId);
    this.myCanvas = draw.getContext("2d");
    this.width = width;
    this.height = height;
    this.wall = [
      {
        position: "top",
        r: 0,
        angle: 0,
        location: {
          y: 0,
        },
      },
      //you
      {
        position: "right",
        r: 0,
        angle: Math.PI / 2,
        location: {
          x: this.width,
        },
      },
      //xia
      {
        position: "bottom",
        r: 0,
        angle: Math.PI * 2,
        location: {
          y: this.height,
        },
      },
      //zuo
      {
        position: "left",
        r: 0,
        angle: (3 * Math.PI) / 2,
        location: {
          x: 0,
        },
      },
    ];
  }
  drawBall(ball) {
    this.myCanvas.beginPath();
    this.myCanvas.strokeStyle = ball.color;
    this.myCanvas.fillStyle = ball.color;

    // 绘制圆的路径
    const x = ball.location.x;
    const y = ball.location.y;
    this.myCanvas.arc(x, y, ball.r, 0, Math.PI * 2, false);
    this.myCanvas.fill();
    // 描边路径
    this.myCanvas.stroke();
  }
  clearCanvas() {
    this.myCanvas.clearRect(0, 0, this.width, this.height);
  }
}
