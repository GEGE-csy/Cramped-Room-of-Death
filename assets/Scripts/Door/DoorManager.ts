
import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, STATE_ENUM } from '../../Enums';
import { Manager } from '../../Base/Manager';
import EventManager from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;
@ccclass('DoorManager')
export class DoorManager extends Manager {
  async init() {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()
    super.init({
      x: 7,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.DOOR
    })  
   
    // 玩家 刚出生/移动结束 都要触发 敌人改变位置面朝玩家
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
  }  

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
  }
  
  onOpen() {
    if( // 全部敌人死亡且玩家未死亡，则开门
      (DataManager.Instance.enemies.every(enemy => enemy.state === STATE_ENUM.DEATH)) &&
      this.state !== STATE_ENUM.DEATH
    ) {
      this.state = STATE_ENUM.DEATH
    }
  }
}
