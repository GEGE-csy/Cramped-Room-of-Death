/**
 * 墙壁类型：1横墙壁 2竖墙壁 3左上墙壁 4右上角墙壁 5左下角墙壁 6右下角墙壁
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
  NEXT_LEVEL = 'NEXT_LEVEL',
  PLAYER_CONTROL = 'PLAYER_CONTROL',
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  PLAYER_BORN = 'PLAYER_BORN',
  ATTACK_PLAYER = 'ATTACK_PLAYER',
  ATTACK_ENEMY = 'ATTACK_ENEMY',
  DOOR_OPEN = 'DOOR_OPEN',
  SHOW_SMOKE = 'SHOW_SMOKE',
  SCREEN_SHAKE = 'SCREEN_SHAKE',
  RECORD_STEP = 'RECORD_STEP',
  REVOKE_STEP = 'REVOKE_STEP',
  RESTART_LEVEL = 'RESTART_LEVEL',
  OUT_BATTLE = 'OUT_BATTLE',
  GAME_OVER = 'GAME_OVER',
  WIN = 'WIN',
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
  TURN_RIGHT = 'TURN_RIGHT',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_BACK = 'BLOCK_BACK',
  BLOCK_LEFT = 'BLOCK_LEFT',
  BLOCK_RIGHT = 'BLOCK_RIGHT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',
  DIRECTION = 'DIRECTION',
  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
  AIR_DEATH = 'AIR_DEATH',

  SPIKES_CUR_COUNT = 'SPIKES_CUR_COUNT',
  SPIKES_TOTAL_COUNT = 'SPIKES_TOTAL_COUNT'
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
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_BACK = 'BLOCK_BACK',
  BLOCK_LEFT = 'BLOCK_LEFT',
  BLOCK_RIGHT = 'BLOCK_RIGHT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',

  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
  AIR_DEATH = 'AIR_DEATH'
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3
}
// 实体类型
export enum ENTITY_TYPE_ENUM {
  PLAYER = 'PLAYER',
  SKELETON_WOODEN = 'SKELETON_WOODEN',
  SKELETON_IRON = 'SKELETON_IRON',
  DOOR = 'DOOR',
  BURSTS = 'BURSTS',
  SPIKE_ONE = 'SPIKE_ONE',
  SPIKE_TWO = 'SPIKE_TWO',
  SPIKE_THREE = 'SPIKE_THREE',
  SPIKE_FOUR = 'SPIKE_FOUR',
  SMOKE = 'SMOKE'
}

export enum SPIKES_TYPE_TOTAL_COUNT_ENUM {
  SPIKE_ONE = 2,
  SPIKE_TWO = 3,
  SPIKE_THREE = 4,
  SPIKE_FOUR = 5
}

export enum SPIKES_COUNT_ENUM {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE'
}

export enum SPIKES_COUNT_NUMBER_ENUM {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5
}

export enum SHAKE_TYPE_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum SCENE_ENUM {
  Loading = 'Loading',
  Start = 'Start',
  Battle = 'Battle',
  GAME_OVER = 'Over',
  WIN = 'End'
}