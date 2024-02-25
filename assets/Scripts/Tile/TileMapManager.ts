
import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import Levels from '../../Levels/index';
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils';
import DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';


@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const spriteFrames = await ResourceManager.Instance.loadResources('texture/tile/tile')
    const { mapInfo } = DataManager.Instance
    DataManager.Instance.tileInfo = []
    for(let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      DataManager.Instance.tileInfo[i] = []
      for(let j = 0; j < column.length; j++) {
        const item = column[j]
        // 空要跳过
        if(item.src === null || item.type === null) {
          continue
        }
        // 渲染瓦片
        const node = createUINode()
        let number = item.src, type = item.type
        // 1234/5678/9101112 可以随机瓦片，并且控制一下随机范围，只有偶数
        if((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          number += randomByRange(0, 4)
        }
        const imgSrc = `tile (${number})`
        const spriteFrame = spriteFrames.find(item => item.name === imgSrc) || spriteFrames[0]
        const tileManager = node.addComponent(TileManager)
        tileManager.init(type, spriteFrame, i, j)
        // 将瓦片信息存入数据中心
        DataManager.Instance.tileInfo[i][j] = tileManager
        node.setParent(this.node)
      }
    }
  }
}
