/**
 * 墙壁类型：1横墙壁 2竖墙壁 3左上角 4右上角 5左下角 6右下角
 *          7悬崖左 8悬崖右 9悬崖中 10地板
 */
export enum TILE_TYPE_ENUM {
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  CLIFF_CENTER = 'CLIFF_CENTER',
  CLIFF_LEFT = 'CLIFF_LEFT',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  FLOOR = 'FLOOR'
}

// 事件类型
export enum EVENT_ENUM {
  NEXT_ENUM = 'NEXT_ENUM',
  PLAYER_CONTROL = 'PLAYER_CONTROL'
}

// 点击方向
export enum CONTROLLER_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT'
}
// fsm参数列表的类型枚举
export enum FSM_PARAMS_TYPE_ENUM {
  TRIGGER = 'TRIGGER',
  NUMBER = 'NUMBER'
}
// fsm状态
export enum PARAM_NAME_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  DIRECTION = 'DIRECTION'
}
// 人物方向
export enum DIRECTION_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
// 人物状态
export enum STATE_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT'
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3
}