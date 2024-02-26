import { EnemyManager } from "../Base/EnemyManager"
import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { DoorManager } from "../Scripts/Door/DoorManager"
import { PlayerManager } from "../Scripts/Player/PlayerManager"
import { TileManager } from "../Scripts/Tile/TileManager"

// 数据中心
export default class DataManager extends Singleton {
  static get Instance() {
    // 重写父类的GetInstance，为了获取类型
    return super.GetInstance<DataManager>()
  }
  player: PlayerManager
  enemies: EnemyManager[]
  door: DoorManager
  mapInfo: Array<ITile[]> = []
  tileInfo: Array<TileManager[]> = []
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1

  
  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0

    this.player = null
    this.door = null
    this.enemies = []
  }
}
