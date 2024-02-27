import { _decorator, Animation } from "cc";
import {
	ENTITY_TYPE_ENUM,
	FSM_PARAMS_TYPE_ENUM,
	PARAM_NAME_ENUM,
	SPIKES_TYPE_TOTAL_COUNT_ENUM,
	STATE_ENUM,
} from "../../Enums";
import StateMachine, { getInitParamsNumber } from "../../Base/StateMachine";
import { Manager } from "../../Base/Manager";
import SpikeOneSubStateMachine from "./SpikeOneSubStateMachine";
import SpikeTwoSubStateMachine from "./SpikeTwoSubStateMachine";
import SpikeThreeSubStateMachine from "./SpikeThreeSubStateMachine";
import SpikeFourSubStateMachine from "./SpikeFourSubStateMachine";
import { SpikesManager } from "./SpikesManager";
const { ccclass, property } = _decorator;

export interface IParamValue {
	type: FSM_PARAMS_TYPE_ENUM;
	value: boolean | number;
}

@ccclass("SpikesStateMachine")
export class SpikesStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.node.addComponent(Animation);
		this.initParams();
		this.initStateMachines();
		this.initAnimationEvent();
		// 等所有资源加载完才会退出init
		await Promise.all(this.waitingList);
	}
	initParams() {
		this.params.set(PARAM_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber());
		this.params.set(PARAM_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber());
	}
	// 初始化状态机列表
	initStateMachines() {
		this.stateMachines.set(
			ENTITY_TYPE_ENUM.SPIKE_ONE,
			new SpikeOneSubStateMachine(this)
		);
		this.stateMachines.set(
			ENTITY_TYPE_ENUM.SPIKE_TWO,
			new SpikeTwoSubStateMachine(this)
		);
		this.stateMachines.set(
			ENTITY_TYPE_ENUM.SPIKE_THREE,
			new SpikeThreeSubStateMachine(this)
		);
		this.stateMachines.set(
			ENTITY_TYPE_ENUM.SPIKE_FOUR,
			new SpikeFourSubStateMachine(this)
		);
	}
	initAnimationEvent() {
		// 监听动画完成，如果执行的是turn相关的动画，要恢复到idle状态
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
		  const name = this.animationComponent.defaultClip.name
      const value = this.getParams(PARAM_NAME_ENUM.SPIKES_TOTAL_COUNT)
      if(
        (value === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_ONE && name.includes(`spikesone/two`)) ||
        (value === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_TWO && name.includes(`spikesone/three`)) ||
        (value === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_THREE && name.includes(`spikesone/four`)) || 
        (value === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_FOUR && name.includes(`spikesone/five`))
      ) {
        this.node.getComponent(SpikesManager).backZero()
      }
		})
	}
	// 两个状态之间的run，改变参数的时候要执行，从而修改currentState
	run() {
		const totalCount = this.getParams(PARAM_NAME_ENUM.SPIKES_TOTAL_COUNT);
		switch (this.currentState) {
			case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE):
			case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_TWO):
			case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_THREE):
			case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_FOUR):
				if (totalCount === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_ONE) {
					this.currentState = this.stateMachines.get(
						ENTITY_TYPE_ENUM.SPIKE_ONE
					);
				} else if (totalCount === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_TWO) {
					this.currentState = this.stateMachines.get(
						ENTITY_TYPE_ENUM.SPIKE_TWO
					);
				} else if (totalCount === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_THREE) {
					this.currentState = this.stateMachines.get(
						ENTITY_TYPE_ENUM.SPIKE_THREE
					);
				}else if (totalCount === SPIKES_TYPE_TOTAL_COUNT_ENUM.SPIKE_FOUR) {
					this.currentState = this.stateMachines.get(
						ENTITY_TYPE_ENUM.SPIKE_FOUR
					);
				}else {
					// 触发set currentState
					this.currentState = this.currentState;
				}
				break;
			default:
				this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
				break;
		}
	}
}
