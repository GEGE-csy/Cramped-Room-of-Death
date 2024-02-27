import { _decorator } from "cc";
import State from "../../Base/State";
import StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";

// smoke的死亡动画就是张空图片，用door的就ok
const BASE_URL = "texture/door/death";
export default class DeathSubStateMachine extends DirectionSubStateMachine {
	constructor(fsm: StateMachine) {
		super(fsm);
		this.stateMachines.set(
			DIRECTION_ENUM.TOP,
			new State(fsm, `${BASE_URL}`)
		);
		this.stateMachines.set(
			DIRECTION_ENUM.BOTTOM,
			new State(fsm, `${BASE_URL}`)
		);
		this.stateMachines.set(
			DIRECTION_ENUM.LEFT,
			new State(fsm, `${BASE_URL}`)
		);
		this.stateMachines.set(
			DIRECTION_ENUM.RIGHT,
			new State(fsm, `${BASE_URL}`)
		);
	}
}
