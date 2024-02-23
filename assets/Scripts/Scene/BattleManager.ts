
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
const { ccclass, property } = _decorator;
 
@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    onLoad() {
      EventManager.Instance.on(EVENT_ENUM.NEXT_ENUM, this.nextLevel, this)
    }

    onDestroy() {
      EventManager.Instance.off(EVENT_ENUM.NEXT_ENUM, this.nextLevel)
    }

    start () {
      this.generateStage()
      this.initLevel()
    }

    initLevel() {
      const level = Levels[`level${DataManager.Instance.levelIndex}`]
      if(level) {
        this.clearLevel()
        this.level = level
        // 将当前关卡信息存入数据中心
        DataManager.Instance.mapInfo = this.level.mapInfo
        DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
        DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0
        this.generateTileMap()
        this.generatePlayer()
      }
    }

    nextLevel() {
      DataManager.Instance.levelIndex++
      this.initLevel()
    }

    clearLevel() {
      this.stage.destroyAllChildren()
      DataManager.Instance.reset()
    }

    generateStage() {
      this.stage = createUINode()
      this.stage.setParent(this.node)
    }

    generateTileMap() {
      const tileMap = createUINode()
      tileMap.setParent(this.stage)
      const tileMapManager = tileMap.addComponent(TileMapManager)
      tileMapManager.init()

      this.adaptPosition()
    }

    generatePlayer() {
      const player = createUINode()
      player.setParent(this.stage)
      const playerManager = player.addComponent(PlayerManager)
      playerManager.init()
    }
    // 适配地图处于屏幕正中间
    adaptPosition() {
      const { mapRowCount, mapColumnCount } = DataManager.Instance
      const distanceX = TILE_WIDTH * mapRowCount / 2
      const distanceY = TILE_HEIGHT * mapColumnCount / 2 + 80

      this.stage.setPosition(-distanceX, distanceY)
    }


}
