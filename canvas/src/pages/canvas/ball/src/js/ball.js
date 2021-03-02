export class Ball {
  constructor(location, r, id, name, speed, angle, color, knockUpdate) {
    this.location = location;
    this.r = r;
    this.id = id;
    this.name = name;
    this.speed = speed;
    this.angle = angle;
    this.color = color;
    this.knockUpdate = knockUpdate;
  }
  //   getLocation() {
  //     return this, location;
  //   }
  //   setLocation(x, y) {
  //     this.location.x = x;
  //     this.location.y = y;
  //   }
  //   getAngle() {
  //     return this.angle;
  //   }
  //   setAngle(angle) {
  //     this.angle = angle;
  //   }
  //   getKnockUpdate() {
  //     return this.knockUpdate;
  //   }
  //   setKnockUpdate(knockUpdate) {
  //     this.knockUpdate = knockUpdate;
  //   }
  /**
   * @description 小球移动
   * @param {移动时间} time
   */
  move(time) {
    const location = this.location;
    const speed = this.speed;
    const angle = this.angle;
    //获取x和y方向上的距离
    const locationNew = this.getNewLocation(
      location.x,
      location.y,
      speed,
      angle,
      time
    );
    this.location = locationNew;
  }
  /**
   * @description 根据当前位置、速度、角度、时间计算新的位置
   * @param x:x坐标
   * @param y:y坐标
   * @param angle:角度弧度
   * @param time:时间
   */
  getNewLocation(x, y, speed, angle, time) {
    const distance = (speed * time) / 1000.0;
    const xDistance = distance * Math.cos(angle);
    const yDistance = distance * Math.sin(angle);
    return { x: x + xDistance, y: y + yDistance };
  }
}
