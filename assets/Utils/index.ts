import { Layers, Node, SpriteFrame, UITransform } from 'cc'

// 对于渲染节点的统一设置
export const createUINode = (name: string = '') => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0,1)
  node.layer = 1 << Layers.nameToLayer("UI_2D")
  return node
}
// 获取指定范围内的随机数，用于随机地图
export const randomByRange = (start: number, end: number) => {
  return Math.floor((end - start) * Math.random()) + start
}

// 将动画帧排序，防止自动排序混乱
const reg = /\((\d+)\)/
const getNumberString = (str: string) => parseInt(str.match(reg)[1] || '0')
export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) => spriteFrames.sort((a,b) => getNumberString(a.name) - getNumberString(b.name))

export const getRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}