
import { _decorator } from 'cc';
import { IEntity } from '../../Levels';
import { Manager } from '../../Base/Manager';
import { SmokeStateMachine } from './SmokeStateMachine';
const { ccclass, property } = _decorator;

@ccclass('SmokeManager')
export class SmokeManager extends Manager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)  
  }  
}
