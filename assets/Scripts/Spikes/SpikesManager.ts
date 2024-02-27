
import { _decorator, Component, Sprite, UITransform } from 'cc';
import { ENTITY_TYPE_ENUM, EVENT_ENUM, PARAM_NAME_ENUM, SPIKES_TYPE_TOTAL_COUNT_ENUM, STATE_ENUM } from '../../Enums';
import {  ISpikes } from '../../Levels';
import { SpikesStateMachine } from './SpikesStateMachine';
import { getRandomString } from '../../Utils';
import StateMachine from '../../Base/StateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;


@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id: string = getRandomString(12)
  x: number 
  y: number 
  fsm: StateMachine

  protected transform: UITransform
  private _count: number
  private _totalCount: number
  type: ENTITY_TYPE_ENUM

  get count() {
    return this._count
  }
  set count(newCount) {
    this._count = newCount
    this.fsm.setParams(PARAM_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
  }
  get totalCount() {
    return this._totalCount
  }
  set totalCount(newTotalCount) {
    this._totalCount = newTotalCount
    this.fsm.setParams(PARAM_NAME_ENUM.SPIKES_TOTAL_COUNT, newTotalCount)
  }
  async init(params: ISpikes) {
    const sprite = this.node.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    this.transform = this.getComponent(UITransform)
    this.transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()
    this.totalCount = SPIKES_TYPE_TOTAL_COUNT_ENUM[this.type]
    this.count = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }  
  update() {
    // 人物宽高是4个瓦片，需要使人物居中
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
  }
  onLoop() {
    if(this.count === this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }
    this.onAttack()
  }
  backZero() {
    this.count = 0
  }
  onAttack() {
    if(!DataManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    // 碰到地刺，且地刺正好刺出
    if(this.x === playerX && this.y === playerY && this.count === this.totalCount) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, STATE_ENUM.DEATH)
    }
  }
}
