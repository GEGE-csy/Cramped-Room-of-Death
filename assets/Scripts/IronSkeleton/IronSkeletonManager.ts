
import { _decorator } from 'cc';
import { EVENT_ENUM, STATE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
const { ccclass, property } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)  
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }  

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
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
}
