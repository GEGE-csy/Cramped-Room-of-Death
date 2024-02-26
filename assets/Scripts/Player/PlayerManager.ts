
import { _decorator } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, STATE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { Manager } from '../../Base/Manager';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;


@ccclass('PlayerManager')
export class PlayerManager extends Manager {
  targetX: number
  targetY: number
  isMoving = false

  private readonly speed = 1 / 10

  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init(params)  
    this.targetX = this.x
    this.targetY = this.y
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CONTROL, this.handleInput, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }  
  update() {
    this.updateXY()
    super.update()
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
    if (
      Math.abs(this.targetX - this.x) < 0.01 && 
      Math.abs(this.targetY - this.y) < 0.01 &&
      this.isMoving
    ) {
      this.isMoving = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  onDead(type: STATE_ENUM) {
    this.state = type
  }
  handleInput(inputDirection: CONTROLLER_ENUM) {
    if(this.isMoving) { 
      return
    }
    if( // 玩家已死/在空中死/在攻击时不移动
      this.state === STATE_ENUM.DEATH || 
      this.state === STATE_ENUM.AIR_DEATH || 
      this.state === STATE_ENUM.ATTACK
      ) {
      return
    }
    const id = this.willAttack(inputDirection)
    if(id) {  // 可能有多个敌人，需要拿到enemy id判断是哪个敌人死了
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      return
    }
    if(this.willBlock(inputDirection)) { // 撞了
      console.log('block');
      return 
    }
    this.move(inputDirection)
  }
  move(inputDirection: CONTROLLER_ENUM) {
    switch(inputDirection) {
      case CONTROLLER_ENUM.TOP:
        this.targetY -= 1
        this.isMoving = true
        break
      case CONTROLLER_ENUM.BOTTOM:
        this.targetY += 1
        this.isMoving = true
        break
      case CONTROLLER_ENUM.LEFT:
        this.targetX -= 1
        this.isMoving = true
        break
      case CONTROLLER_ENUM.RIGHT:
        this.targetX += 1
        this.isMoving = true
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
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        this.state = STATE_ENUM.TURN_LEFT
        break
      case CONTROLLER_ENUM.TURN_RIGHT:
        if(this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if(this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP
        } else if(this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if(this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        }
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        this.state = STATE_ENUM.TURN_RIGHT
    }
  }

  willAttack(type: CONTROLLER_ENUM) {
    // 过滤掉死亡的敌人
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== STATE_ENUM.DEATH)
    for(let i = 0; i < enemies.length; i++) {
      const { x: enemyX, y: enemyY, id: enemyId } = enemies[i]
      // 输入方向和枪的方向一致，判断枪头是否到达敌人
      if ( 
        this.direction === DIRECTION_ENUM.TOP &&
        type === CONTROLLER_ENUM.TOP && 
        enemyX === this.x && 
        enemyY === this.targetY - 2
      ) {
        this.state = STATE_ENUM.ATTACK
        return enemyId
      } else if (
        this.direction === DIRECTION_ENUM.LEFT &&
        type === CONTROLLER_ENUM.LEFT && 
        enemyX === this.x - 2 && 
        enemyY === this.targetY 
      ) {
        this.state = STATE_ENUM.ATTACK
        return enemyId
      } else if (
        this.direction === DIRECTION_ENUM.BOTTOM &&
        type === CONTROLLER_ENUM.BOTTOM && 
        enemyX === this.x && 
        enemyY === this.targetY + 2
      ) {
        this.state = STATE_ENUM.ATTACK
        return enemyId
      } else if (
        this.direction === DIRECTION_ENUM.RIGHT &&
        type === CONTROLLER_ENUM.RIGHT && 
        enemyX === this.x + 2 && 
        enemyY === this.targetY
      ) {
        this.state = STATE_ENUM.ATTACK
        return enemyId
      }
    }
    return ''
  }
  // 判断用户输入行为是否会触发碰撞
  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo, mapRowCount: row, mapColumnCount: column } = DataManager.Instance
    if(inputDirection === CONTROLLER_ENUM.TOP) {
      const playerNextY = y - 1 // 人的下一个y坐标
      if(direction === DIRECTION_ENUM.TOP) {  // 当前方向向上且输入方向向上 
        if(playerNextY < 0) { 
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
        }
        const weaponNextY = y - 2 // 枪的下一个y坐标
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[x][weaponNextY]
        // 人和枪都能走
        if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
        else {
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
        }
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        if(playerNextY < 0) { 
          this.state = STATE_ENUM.BLOCK_BACK
          return true
        }
        const weaponNextY = y // 枪的下一个y坐标
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[x][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_BACK
          return true
         }
      } else if(direction === DIRECTION_ENUM.LEFT) {
        if(playerNextY < 0) { 
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
        }
        const weaponNextX = x - 1 
        const weaponNextY = y - 1
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
         }
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        if(playerNextY < 0) { 
          this.state = STATE_ENUM.BLOCK_LEFT
          return true
        }
        const weaponNextX = x + 1 
        const weaponNextY = y - 1
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
        // 人和枪都能走
        if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
        else {
        this.state = STATE_ENUM.BLOCK_LEFT
        return true
        }
      }
    } else if(inputDirection === CONTROLLER_ENUM.BOTTOM) {
      const playerNextY = y + 1 // 人的下一个y坐标
      if(direction === DIRECTION_ENUM.TOP) {  // 当前方向向上且输入方向向下
        if(playerNextY > column - 1) { 
          this.state = STATE_ENUM.BLOCK_BACK
          return true
        }
        const weaponNextY = y  // 枪的下一个y坐标
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[x][weaponNextY]
        // 人和枪都能走
        if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
        else {
          this.state = STATE_ENUM.BLOCK_BACK
          return true
        }
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        if(playerNextY > column - 1) { 
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
        }
        const weaponNextY = y + 2 // 枪的下一个y坐标
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[x][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
         }
      } else if(direction === DIRECTION_ENUM.LEFT) {
        if(playerNextY > column - 1) { 
          this.state = STATE_ENUM.BLOCK_LEFT
          return true
        }
        const weaponNextX = x - 1 
        const weaponNextY = y + 1
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_LEFT
          return true
         }
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        if(playerNextY > column - 1) { 
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
        }
        const weaponNextX = x + 1 
        const weaponNextY = y + 1
        const playerNextTile = tileInfo[x][playerNextY]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
         }
      }
    } else if(inputDirection === CONTROLLER_ENUM.LEFT) {
      const playerNextX = x - 1 // 人的下一个x坐标
      if(direction === DIRECTION_ENUM.TOP) {  // 当前方向向上且输入方向向左 
        if(playerNextX < 0) { 
          this.state = STATE_ENUM.BLOCK_LEFT
          return true
        }
        const weaponNextX = x - 1
        const weaponNextY = y - 1  
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
        // 人和枪都能走
        if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
        else {
          this.state = STATE_ENUM.BLOCK_LEFT
          return true
        }
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        if(playerNextX < 0) { 
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
        }
        const weaponNextX = x - 1
        const weaponNextY = y + 1 
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_RIGHT
           return true
         }
      } else if(direction === DIRECTION_ENUM.LEFT) {
        if(playerNextX < 0) { 
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
        }
        const weaponNextX = x - 2
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][y]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
         }
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        if(playerNextX < 0) { 
          this.state = STATE_ENUM.BLOCK_BACK
          return true
        }
        const weaponNextX = x 
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][y]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_BACK
          return true
         }
      }
    } else if(inputDirection === CONTROLLER_ENUM.RIGHT) {
      const playerNextX = x + 1 // 人的下一个x坐标
      if(direction === DIRECTION_ENUM.TOP) {  // 当前方向向上且输入方向向右 
        if(playerNextX > row - 1) { 
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
        }
        const weaponNextX = x + 1 
        const weaponNextY = y - 1
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
        // 人和枪都能走
        if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
        else {
          this.state = STATE_ENUM.BLOCK_RIGHT
          return true
        }
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        if(playerNextX > row - 1) {
          this.state = STATE_ENUM.BLOCK_LEFT 
          return true
        }
        const weaponNextX = x + 1
        const weaponNextY = y + 1 
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][weaponNextY]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_LEFT
           return true
         }
      } else if(direction === DIRECTION_ENUM.LEFT) {
        if(playerNextX > row - 1) { 
          this.state = STATE_ENUM.BLOCK_BACK
          return true
        }
        const weaponNextX = x
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][y]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_BACK
          return true
         }
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        if(playerNextX > row - 1) { 
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
        }
        const weaponNextX = x + 2
        const playerNextTile = tileInfo[playerNextX][y]
        const weaponNextTile = tileInfo[weaponNextX][y]
         // 人和枪都能走
         if(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable)) {}
         else {
          this.state = STATE_ENUM.BLOCK_FRONT
          return true
         }
      }
    } else if(inputDirection === CONTROLLER_ENUM.TURN_LEFT) {
      let nextX: number, nextY: number
      //朝上左转的话，左上角三个tile都必须turnable为true
      if(direction === DIRECTION_ENUM.TOP) {
        nextX = x - 1
        nextY = y - 1
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x + 1
        nextY = y + 1
      } else if(direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y + 1
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y - 1
      }
      if(
        (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) && 
        (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) && 
        (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
        ) {} else {
          this.state = STATE_ENUM.BLOCK_TURN_LEFT
          return true
        }
    } else if(inputDirection === CONTROLLER_ENUM.TURN_RIGHT) {
      let nextX: number, nextY: number
      //朝上右转的话，右上角三个tile都必须turnable为true
      if(direction === DIRECTION_ENUM.TOP) {
        nextX = x + 1
        nextY = y - 1
      } else if(direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x - 1
        nextY = y + 1
      } else if(direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1
        nextY = y - 1
      } else if(direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1
        nextY = y + 1
      }
      if(
        (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) && 
        (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
        ) {} else {
          this.state = STATE_ENUM.BLOCK_TURN_RIGHT
          return true
        }
    } 
    return false
  }
}
