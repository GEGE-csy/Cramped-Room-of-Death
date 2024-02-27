
import { UITransform, _decorator } from 'cc';
import { EVENT_ENUM, STATE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
import { Manager } from '../../Base/Manager';
import { BurstStateMachine } from './BurstStateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends Manager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)  
    // 地裂陷井和瓦片大小一样
    this.transform = this.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }  

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
  }
  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }
  onBurst() {
    if(this.state === STATE_ENUM.DEATH) {
      return
    }
    const { targetX: playerX, targetY: playerY } = DataManager.Instance.player
    // 走到地裂陷井
    if(this.x === playerX && this.y === playerY && this.state === STATE_ENUM.IDLE) {
      this.state = STATE_ENUM.ATTACK
    } else if(this.state === STATE_ENUM.ATTACK){
      this.state = STATE_ENUM.DEATH
      // 如果裂开的时候，人在陷阱上，则在空中死
      if(this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, STATE_ENUM.AIR_DEATH)
      }
    }
  }
}
