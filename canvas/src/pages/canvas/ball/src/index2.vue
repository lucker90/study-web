<template>
  <!-- <div class="container" > -->
  <canvas
    class="container"
    id="myCanvas"
    :width="size.width"
    :height="size.height"
  ></canvas>
  <!-- </div> -->
</template>

<script>
import { Ball } from "./js/ball.js";
import { Canvas } from "./js/canvas.js";
export default {
  props: [],
  data() {
    return {
      timeInterval: 2,
      myCanvas: null,
      balls: [],
      size: {
        width: 800,
        height: 600,
      },
      ballsInfo: [
        {
          location: {
            //位置
            x: 60,
            y: 60,
          },
          r: 20, //半径
          id: "1", //id
          name: "小明", //名字
          speed: "200", //速度
          angle: Math.PI / 3, //角度
          color: "red",
          knockUpdate: false,
        },
        {
          location: {
            x: 300,
            y: 60,
          },
          r: 20,
          id: "2",
          name: "小刚",
          speed: "400",
          angle: Math.PI,
          color: "blue",
          knockUpdate: false,
        },
        {
          location: {
            x: 300,
            y: 300,
          },
          r: 20,
          id: "3",
          name: "小刚",
          speed: "600",
          angle: Math.PI / 4,
          color: "black",
          knockUpdate: false,
        },
        {
          location: {
            x: 300,
            y: 140,
          },
          r: 20,
          id: "4",
          name: "小刚",
          speed: "600",
          angle: (3 * Math.PI) / 4,
          color: "yellow",
          knockUpdate: false,
        },
      ],
    };
  },
  computed: {},
  mounted() {
    this.myCanvas = new Canvas("myCanvas", this.size.width, this.size.height);
    this.init();
  },
  methods: {
    /**
     * @description 开始绘制小球,并初始化运动
     */
    init() {
      this.ballsInfo.forEach((item) => {
        let ball = new Ball(
          item.location,
          item.r,
          item.id,
          item.name,
          item.speed,
          item.angle,
          item.color,
          item.knockUpdate
        );
        this.balls.push(ball);
      });
      setInterval(() => {
        this.myCanvas.clearCanvas();
        this.balls.forEach((ball) => {
          this.myCanvas.drawBall(ball);
        });
        this.computeNewState();
      }, this.timeInterval);
    },
    /**
     * @description 计算所有球信的状态（位置和角度）
     */
    computeNewState() {
      // 计算新的位置
      this.balls.forEach((ball) => {
        ball.move(this.timeInterval);
      });
      this.balls.forEach((ball) => {
        //新的位置是否会存在碰撞，如果碰撞则进行微调（位置和角度，目前只改变角度，忽略简单位置）
        this.getKnockedInfo(ball);
      });
      this.balls.forEach((ball) => {
        ball.knockUpdate = false;
      });
    },
    getKnockedInfo(ball) {
      const location = ball.location;
      const r = ball.r;
      const angle = ball.angle;
      //判断和球之间的碰撞
      this.balls.forEach((ballItem) => {
        if (ballItem.id !== ball.id) {
          const locationItem = ballItem.location;
          const rItem = ballItem.r;
          const angleItem = ballItem.angle;
          const isBallKnock = this.isKnock(
            location,
            angle,
            r,
            locationItem,
            angleItem,
            rItem
          );
          if (isBallKnock) {
            //球和球之间发生了碰撞发生了碰撞
            if (!ball.knockUpdate) {
              ball.angle = this.getNewAngleAfterBall(angle);
              ball.knockUpdate = true;
            }
            if (!ballItem.knockUpdate) {
              ballItem.angle = this.getNewAngleAfterBall(ballItem.angle);
              ballItem.knockUpdate = true;
            }
          }
        }
      });
      //判断和四个墙面之间的碰撞
      this.myCanvas.wall.forEach((item) => {
        const locationItem = item.location;
        const rItem = item.r;
        const angleItem = item.angle;
        const isWallKnock = this.isKnock(
          location,
          angle,
          r,
          locationItem,
          angleItem,
          rItem
        );
        if (isWallKnock) {
          // ballInfo.angle=(((angle/Math.PI+1))%2)*Math.PI
          ball.angle = this.getNewAngleAfterWall(item, angle);
        }
      });
    },
    /**
     * 与球碰撞之后的角度
     */
    getNewAngleAfterBall(angle) {
      return ((angle / Math.PI + 1) % 2) * Math.PI;
    },
    /**
     * @description 与墙碰撞之后的角度
     */
    getNewAngleAfterWall(wall, angle) {
      let newAngle = angle;
      const position = wall.position;
      if (position === "top" || position === "bottom") {
        newAngle = 2 * Math.PI - angle;
      } else {
        newAngle = Math.PI - angle;
      }
      return newAngle;
    },
    /**
     * @description 判断球是否发生碰撞
     */
    isKnock(l1, angle1, r1, l2, angle2, r2) {
      if (angle1 + angle2 !== 0 && angle1 + angle2 !== 2) {
        //角度
        const distance = this.getDistance(l1, l2);
        if (distance <= r1 + r2) {
          return true;
        }
      }
      return false;
    },
    /**
     * @description 获取两个坐标点的距离
     */
    getDistance(l1, l2) {
      const x2 =
        l1.x === undefined || l2.x === undefined ? 0 : Math.pow(l1.x - l2.x, 2);
      const y2 =
        l1.y === undefined || l2.y === undefined ? 0 : Math.pow(l1.y - l2.y, 2);
      return Math.sqrt(x2 + y2);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background-color: aquamarine;
  margin: auto;
  transform: translateY(40%);
  display: block;
}
</style>
