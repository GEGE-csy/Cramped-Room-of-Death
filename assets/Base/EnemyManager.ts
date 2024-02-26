
import { _decorator } from 'cc';
import { DIRECTION_ENUM, EVENT_ENUM, STATE_ENUM } from '../Enums';
import { IEntity } from '../Levels';
import EventManager from '../Runtime/EventManager';
import { Manager } from './Manager';
import DataManager from '../Runtime/DataManager';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Manager {
  async init(params: IEntity) {
    super.init(params)  
   
    // 玩家 刚出生/移动结束 都要触发 敌人改变位置面朝玩家
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)
    this.onChangeDirection(true)
  }  

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }
  // 判断玩家在骷髅的哪个方向，从而改变骷髅的方向始终面朝玩家
  onChangeDirection(isInit: boolean = false) {
    if(this.state === STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)

    // 敌人在初始化时要调整一次面向
    if(disX === disY && !isInit) {
      return 
    }
    // 玩家在骷髅的第一象限
    if(playerX >= this.x && playerY <= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if(playerX <= this.x && playerY <= this.y) { // 第二
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if(playerX <= this.x && playerY >= this.y) { // 第三
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    } else if(playerX >= this.x && playerY >= this.y){ // 第四
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    }
  }
  onDead(id: string) {
    if(this.state === STATE_ENUM.DEATH) {
      return 
    }
    if(this.id === id) { 
      this.state = STATE_ENUM.DEATH
    }
  }
}
