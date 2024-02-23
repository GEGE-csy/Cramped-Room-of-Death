import { Layers, Node, UITransform } from 'cc'

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