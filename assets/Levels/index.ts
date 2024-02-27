import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, STATE_ENUM, TILE_TYPE_ENUM } from "../Enums";
import level1 from "./level1";
import level2 from "./level2";

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
}

const levels: Record<string, ILevel> = {
  level1,
  level2
}
export default levels