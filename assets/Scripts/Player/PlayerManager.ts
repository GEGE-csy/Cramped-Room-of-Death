
import { _decorator, Component, Sprite, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, EVENT_ENUM, PARAM_NAME_ENUM, STATE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass, property } = _decorator;


@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x: number = 0
  y: number = 0
  targetX: number = 0
  targetY: number = 0

  fsm: PlayerStateMachine
  private readonly speed = 1 / 10
  private _direction: DIRECTION_ENUM
  private _state: STATE_ENUM
  
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
  async init() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    // 要保证setParams在init后执行，fsm的init中有资源加载，必须保证所有资源加载完才退出init
    this.state = STATE_ENUM.IDLE
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.move, this)
  }  
  update() {
    this.updateXY()
    // 人物宽高是4个瓦片，需要使人物居中
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
  updateXY() {
    if(this.targetX < this.x) {
      this.x -= this.speed
    } else if(this.targetX > this.x) {
      this.x += this.speed
    }

    if(this.targetY < this.y) {
      this.y -= this.speed
    } else if(this.targetY > this.y) {
      this.y += this.speed
    }
    // x和targetX已经接近相等
    if(Math.abs(this.targetX - this.x) <= Number.EPSILON && Math.abs(this.targetY - this.y) <= Number.EPSILON) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }
  move(direction: CONTROLLER_ENUM) {
    switch(direction) {
      case CONTROLLER_ENUM.TOP:
        this.targetY -= 1
        break
      case CONTROLLER_ENUM.BOTTOM:
        this.targetY += 1
        break
      case CONTROLLER_ENUM.LEFT:
        this.targetX -= 1
        break
      case CONTROLLER_ENUM.RIGHT:
        this.targetX += 1
        break
      case CONTROLLER_ENUM.TURN_LEFT:
        if(this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if(this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if(this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if(this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = STATE_ENUM.TURN_LEFT
    }
  }
}
