
import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc';
import FadeManager from '../../Runtime/FadeManager';
import { SCENE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;
 
@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null
  onLoad() {
    resources.preloadDir('texture', (cur, total) => {
      this.bar.progress = cur / total
    }, () => {
      director.loadScene(SCENE_ENUM.Start)
    })
  }
}
