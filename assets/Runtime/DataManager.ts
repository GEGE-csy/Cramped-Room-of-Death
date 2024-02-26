import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { PlayerManager } from "../Scripts/Player/PlayerManager"
import { TileManager } from "../Scripts/Tile/TileManager"
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager"

// 数据中心
export default class DataManager extends Singleton {
  static get Instance() {
    // 重写父类的GetInstance，为了获取类型
    return super.GetInstance<DataManager>()
  }
  player: PlayerManager
  enemies: WoodenSkeletonManager[]
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
    this.enemies = []
  }
}
