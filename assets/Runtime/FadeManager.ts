import Singleton from "../Base/Singleton"
import { createUINode } from "../Utils"
import { RenderRoot2D, game } from "cc"

import { DrawManager, DEFAULT_DURATION } from "../Scripts/UI/DrawManager"

export default class FadeManager extends Singleton {
  static get Instance() {
    // 重写父类的GetInstance，为了获取类型
    return super.GetInstance<FadeManager>()
  }
  private _fade: DrawManager = null

  get fade(): DrawManager {
    if(this._fade !== null) {
      return this._fade
    }
    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    this._fade = fadeNode.addComponent(DrawManager)
    this._fade.init()
    game.addPersistRootNode(root)

    return this._fade
  }
 
  async fadeIn(duration = DEFAULT_DURATION) {
    await this.fade.fadeIn(duration)
  }
  async fadeOut(duration = DEFAULT_DURATION) {
    await this.fade.fadeOut(duration)
  }
  async mask() {
    await this.fade.mask()
  }
}
