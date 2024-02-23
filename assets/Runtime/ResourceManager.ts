import { SpriteFrame, resources } from "cc"
import Singleton from "../Base/Singleton"

// 数据中心
export default class ResourceManager extends Singleton {
  static get Instance() {
    // 重写父类的GetInstance，为了获取类型
    return super.GetInstance<ResourceManager>()
  }
  
  loadResources(path: string, resourceType: typeof SpriteFrame = SpriteFrame) {
    // 使用promise封装回调
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, resourceType, function (err, assets) {
        if(err) {
          reject(err)
          return
        }
        resolve(assets)
      });
    })
  }
}
