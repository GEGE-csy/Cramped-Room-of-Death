import { Layers, Node, SpriteFrame, UITransform } from "cc";

// 对于渲染节点的统一设置
export const createUINode = (name: string = "") => {
	const node = new Node(name);
	const transform = node.addComponent(UITransform);
	transform.setAnchorPoint(0, 1);
	node.layer = 1 << Layers.nameToLayer("UI_2D");
	return node;
};
// 获取指定范围内的随机数，用于随机地图
export const randomByRange = (start: number, end: number) => {
	return Math.floor((end - start) * Math.random()) + start;
};

// 将动画帧排序，防止自动排序混乱
const reg = /\((\d+)\)/;
const getNumberString = (str: string) => parseInt(str.match(reg)[1] || "0");
export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
	spriteFrames.sort(
		(a, b) => getNumberString(a.name) - getNumberString(b.name)
	);

export const getRandomString = (length: number) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

// 封装本地缓存的 API
export const local = {
	// 存储数据
	set(key: string, value: any) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (error) {
			console.error("Error storing item in local storage:", error);
			return false;
		}
	},

	// 获取数据
	get(key: string) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.error("Error retrieving item from local storage:", error);
			return null;
		}
	},
};
