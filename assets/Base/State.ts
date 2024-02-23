
// 1. 需要知道animationClip
// 2. 需要播放动画的能力animation
import { AnimationClip, Sprite, SpriteFrame, animation } from "cc";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";
import ResourceManager from "../Runtime/ResourceManager";

const ANIMATION_SPEED = 1/8 // 1s8帧
export default class State {
  private animationClip: AnimationClip;
  constructor(
    private fsm: PlayerStateMachine, 
    private path: string, 
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
  ) {
    this.init()
  }

  async init() {
    // 加载人物的不同动作图片
    const promise = ResourceManager.Instance.loadResources(this.path)
    console.log(promise)
    console.log()
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise
    console.log(spriteFrames)
    this.animationClip = new AnimationClip();
    // 创建一个对象轨道
    const track  = new animation.ObjectTrack(); 
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame'); // 指定轨道路径，即指定目标对象为 Sprite 子节点的 "spriteFrame" 属性
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
    // 为 x 通道的曲线添加关键帧
    track.channel.curve.assignSorted(frames)      
    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track);
    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * ANIMATION_SPEED // 整个动画剪辑的周期 = 帧数 * 每s多少帧
    this.animationClip.wrapMode = this.wrapMode
  }
  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}