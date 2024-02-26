
import { _decorator, Component, Sprite, UITransform } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_TYPE_ENUM, PARAM_NAME_ENUM, STATE_ENUM } from '../Enums';
import { IEntity } from '../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;


@ccclass('Manager')
export class Manager extends Component {
  x: number = 0
  y: number = 0

  fsm: StateMachine
  private _direction: DIRECTION_ENUM
  private _state: STATE_ENUM
  private type: ENTITY_TYPE_ENUM
  get direction() {
    return this._direction
  }
  set direction(newDirection) {
    this._direction = newDirection
    this.fsm.setParams(PARAM_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }
  get state() {
    return this._state
  }
  set state(newState) {
    this._state = newState
    this.fsm.setParams(newState, true)
  }
  async init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.direction = params.direction
    this.state = params.state
  }  
  update() {
    // 人物宽高是4个瓦片，需要使人物居中
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
