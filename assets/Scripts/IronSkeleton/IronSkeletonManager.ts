
import { _decorator } from 'cc';
import { EVENT_ENUM, STATE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
const { ccclass, property } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }  
}
