
import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, STATE_ENUM } from '../../Enums';
import { Manager } from '../../Base/Manager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends Manager {
  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init({
      x: 2,
      y: 4,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER
    })  
   
    // 玩家 刚出生/移动结束 都要触发 敌人改变位置面朝玩家
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)
    this.onChangeDirection(true)
  }  

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }
  // 判断玩家在木骷髅的哪个方向，从而改变木骷髅的方向始终面朝玩家
  onChangeDirection(isInit: boolean = false) {
    if(this.state === STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
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
  onAttack() {
    if(this.state === STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    // 进入木骷髅的攻击范围
    if(
      (this.x === playerX && Math.abs(this.y - playerY) <= 1) || 
      (this.y === playerY && Math.abs(this.x - playerX) <= 1)
      ) {
      this.state = STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, STATE_ENUM.DEATH)
    } else {
      this.state = STATE_ENUM.IDLE
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
