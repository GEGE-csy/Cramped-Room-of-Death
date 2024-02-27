import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, STATE_ENUM, TILE_TYPE_ENUM } from "../Enums";
import level1 from "./level1";
import level10 from "./level10";
import level2 from "./level2";
import level3 from "./level3";
import level4 from "./level4";
import level5 from "./level5";
import level6 from "./level6";
import level7 from "./level7";
import level8 from "./level8";
import level9 from "./level9";

export interface IEntity {
  x: number
  y: number
  direction: DIRECTION_ENUM
  state: STATE_ENUM
  type: ENTITY_TYPE_ENUM
}
export interface ISpikes {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  count: number
}
export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<ITile[]>
  player: IEntity
  enemies: IEntity[]
  spikes: ISpikes[]
  bursts: IEntity[]
  door: IEntity
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
}
export default levels