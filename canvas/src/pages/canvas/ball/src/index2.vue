<template>
  <!-- <div class="container" > -->
    <canvas class="container" id="myCanvas" :width="size.width" :height="size.height"></canvas>
  <!-- </div> -->
</template>

<script>
export default {
  props:["size"],
  data(){
    return{
      timeInterval:2,
      myCanvas:null,
      ballsInfo:[
        {
        location:{//位置
            x:60,
            y:60
          },
          r:20,//半径
          id:"1",//id
          name:"小明",//名字
          speed:"200",//速度
          angle:Math.PI/3,//角度
          color:"red",
          knockUpdate:false
        },
        {
          location:{
            x:300,
            y:60
          },
          r:20,
          id:"2",
          name:"小刚",
          speed:"400",
          angle:Math.PI,
          color:"blue",
          knockUpdate:false
        },
        {
          location:{
            x:300,
            y:300
          },
          r:20,
          id:"3",
          name:"小刚",
          speed:"600",
          angle:Math.PI/4,
          color:"black",
          knockUpdate:false
        },
        {
          location:{
            x:300,
            y:140
          },
          r:20,
          id:"4",
          name:"小刚",
          speed:"600",
          angle:3*Math.PI/4,
          color:"yellow",
          knockUpdate:false
        }
      ]
    }
  },
  computed:{
    //四个墙面的信息
    wallInfo(){
      return [
        //shang
        {
          position:"top",
          r:0,
          angle:0,
          location:{
            y:0
          }
        },
        //you
        {
          position:"right",
          r:0,
          angle:Math.PI/2,
          location:{
            x:this.size.width
          }
        },
        //xia
        {
          position:"bottom",
          r:0,
          angle:Math.PI*2,
          location:{
            y:this.size.height
          }
        },
        //zuo
        {
          position:"left",
          r:0,
          angle:(3*Math.PI)/2,
          location:{
            x:0
          }
        }
      ]
    }
  },
  mounted(){
    const draw = document.getElementById('myCanvas');
    this.myCanvas = draw.getContext('2d');
    this.init();
  },
  methods:{
    /**
     * @description 开始绘制小球,并初始化运动
     */
    init(){
      setInterval(()=>{
        this.clearBall()
        this.ballsInfo.forEach(item=>{
            this.drawBall(item)
        }) 
        this.computeNewState();
      },this.timeInterval)
    },
    /**
     * @description 计算所有球信的状态（位置和角度）
     */
    computeNewState(){
      // 计算新的位置
      this.ballsInfo.forEach(item=>{
        this.computeNewStateOne(item)
        
      })
      this.ballsInfo.forEach(item=>{
        //新的位置是否会存在碰撞，如果碰撞则进行微调（位置和角度，目前只改变角度，忽略简单位置）
        this.getKnockedInfo(item)
        
      })
      this.ballsInfo.forEach(item=>{
        item.knockUpdate=false
      })
      
    },
    /**
     * @description 计算当前球新的状态
     * @param ballInfo:球信息
     */
    computeNewStateOne(ballInfo){
      const location=ballInfo.location
      const speed=ballInfo.speed
      const angle=ballInfo.angle
      //获取x和y方向上的距离
      const locationNew=this.getNewLocation(location.x,location.y,speed,angle,this.timeInterval)
      ballInfo.location=locationNew
      
    },
    /**
     * @description 根据当前位置、速度、角度、时间计算新的位置
     * @param x:x坐标
     * @param y:y坐标
     * @param angle:角度弧度
     * @param time:时间
     */
    getNewLocation(x,y,speed,angle,time){
      const distance=speed*time/1000.0
      const xDistance=distance*Math.cos(angle)
      const yDistance=distance*Math.sin(angle)
      return {x:(x+xDistance),y:(y+yDistance)}
    },
    /**
     * @description 获取碰撞之后的信息，直接修改最新的角度和位置
     * @param ballInfo:球信息
     */
    getKnockedInfo(ballInfo){
      const location=ballInfo.location
      const r=ballInfo.r
      const angle=ballInfo.angle
      //判断和球之间的碰撞
      this.ballsInfo.forEach(item=>{
        if(item.id!==ballInfo.id){
          const locationItem=item.location
          const rItem=item.r
          const angleItem=item.angle
          const isBallKnock=this.isKnock(location,angle,r,locationItem,angleItem,rItem)
          if(isBallKnock){//球和球之间发生了碰撞发生了碰撞
            if(!ballInfo.knockUpdate){
              ballInfo.angle=this.getNewAngleAfterBall(angle)
              ballInfo.knockUpdate=true
            }
            if(!item.knockUpdate){
              item.angle=this.getNewAngleAfterBall(item.angle)
              item.knockUpdate=true
            }
          }
        } 
      })
      //判断和四个墙面之间的碰撞
      this.wallInfo.forEach(item=>{
        const locationItem=item.location
        const rItem=item.r
        const angleItem=item.angle
        const isWallKnock=this.isKnock(location,angle,r,locationItem,angleItem,rItem)
        if(isWallKnock){
          // ballInfo.angle=(((angle/Math.PI+1))%2)*Math.PI
          ballInfo.angle=this.getNewAngleAfterWall(item,angle)
        }
      })
    },
    /**
     * 与球碰撞之后的角度
     */
    getNewAngleAfterBall(angle){
      return (((angle/Math.PI+1))%2)*Math.PI
    },
    /**
     * @description 与墙碰撞之后的角度
     */
    getNewAngleAfterWall(wall,angle){
      let newAngle=angle;
      const position=wall.position
      if(position==="top"||position==="bottom"){
        newAngle=2*Math.PI-angle
      }else{
        newAngle=Math.PI-angle
      }
      return newAngle
    },
    /**
     * @description 判断球是否发生碰撞
     */
    isKnock(l1,angle1,r1,l2,angle2,r2){
      if(angle1+angle2!==0&&angle1+angle2!==2){//角度
        const distance=this.getDistance(l1,l2)
        if(distance<=r1+r2){
          return true
        }
      }
      return false
    },
    /**
     * @description 获取两个坐标点的距离
     */
    getDistance(l1,l2){
      const x2=(l1.x===undefined)||(l2.x===undefined)?0:Math.pow(l1.x-l2.x,2)
      const y2=(l1.y===undefined)||(l2.y===undefined)?0:Math.pow(l1.y-l2.y,2)
      return Math.sqrt(x2+y2)
    },
    /**
     * @description 清除圆
     */
    clearBall(){
      this.myCanvas.clearRect(0,0,this.size.width,this.size.height);
    },
    /**
     * @description 在指定位置画圆
     * @param ballInfo:球信息
     */
    drawBall(ballInfo){
      this.myCanvas.beginPath();
      // this.myCanvas.lineWidth = 1;
      this.myCanvas.strokeStyle = ballInfo.color;
      this.myCanvas.fillStyle=ballInfo.color;
      
      // 绘制圆的路径
      const x=ballInfo.location.x
      const y=ballInfo.location.y
      this.myCanvas.arc(x, y, ballInfo.r, 0, Math.PI * 2, false);
      this.myCanvas.fill();
      // 描边路径
      this.myCanvas.stroke();

    }
  }

}
</script>

<style lang='less' scoped>
.container{
  background-color:aquamarine;
  margin:auto;
  transform: translateY(40%);
  display: block;
}
</style>