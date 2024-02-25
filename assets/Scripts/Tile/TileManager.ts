
import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

const wall = 'WALL', cliff = 'CLIFF', floor = 'FLOOR'
@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean // 是否可走
  turnable: boolean // 是否可转

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    this.type = type
    
    if(this.type.includes(wall)) {
      this.moveable = false
      this.turnable = false
    } else if(this.type.includes(cliff)) {
      this.moveable = false
      this.turnable = true
    } else if(this.type.includes(floor)){
      this.moveable = true
      this.turnable = true
    }

    const sprite = this.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    // 设置瓦片宽高
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    
    this.node.setPosition(i * TILE_WIDTH, - j * TILE_HEIGHT)
  }
}
