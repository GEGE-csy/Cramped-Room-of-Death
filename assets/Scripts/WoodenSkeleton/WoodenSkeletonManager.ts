
import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, STATE_ENUM } from '../../Enums';
import { Manager } from '../../Base/Manager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;


@ccclass('SkeletonManager')
export class WoodenSkeletonManager extends Manager {
  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init({
      x: 7,
      y: 7,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER
    })  
    // 玩家 刚出生/移动结束 都要触发 敌人改变位置面朝玩家
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
  }  
  // 判断玩家在木骷髅的哪个方向，从而改变木骷髅的方向始终面朝玩家
  onChangeDirection(isInit: boolean = false) {
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)

    if(disX === disY && !isInit) {
      return 
    }
    if(playerX >= this.x && playerY <= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if(playerX <= this.x && playerY <= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if(playerX <= this.x && playerY >= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    } else if(playerX >= this.x && playerY >= this.y){
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    }
  }
}
