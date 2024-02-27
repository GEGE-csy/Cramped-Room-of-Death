// 1. 需要知道animationClip
// 2. 需要播放动画的能力animation
import { AnimationClip, Sprite, SpriteFrame, animation } from "cc";
import ResourceManager from "../Runtime/ResourceManager";
import StateMachine from "./StateMachine";
import { sortSpriteFrame } from "../Utils";

const ANIMATION_SPEED = 1/8; // 1s8帧
export default class State {
	private animationClip: AnimationClip;
	constructor(
		private fsm: StateMachine,
		private path: string,
		private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number = ANIMATION_SPEED
	) {
		this.init();
	}

	async init() {
		// 创建一个对象轨道
		const track = new animation.ObjectTrack();
		// 指定轨道路径，即指定目标对象为 Sprite 子节点的 "spriteFrame" 属性
		track.path = new animation.TrackPath()
			.toComponent(Sprite)
			.toProperty("spriteFrame");
		// 加载人物的不同动作图片
		const promise = ResourceManager.Instance.loadResources(this.path);
		this.fsm.waitingList.push(promise);
		const spriteFrames = await promise;
		const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(
			spriteFrames
		).map((item, index) => [ANIMATION_SPEED * index, item]);
		// 为 x 通道的曲线添加关键帧
		track.channel.curve.assignSorted(frames);

		// 最后将轨道添加到动画剪辑以应用
		this.animationClip = new AnimationClip();
    this.animationClip.name = this.path;
    this.animationClip.duration = frames.length * this.speed; // 整个动画剪辑的周期 = 帧数 * 每s多少帧
		this.animationClip.addTrack(track);
		this.animationClip.wrapMode = this.wrapMode;
	}
	run() {
		if (
			this.fsm.animationComponent.defaultClip?.name === this.animationClip.name
		) {
			return;
		}
		this.fsm.animationComponent.defaultClip = this.animationClip;
		this.fsm.animationComponent.play();
	}
}
