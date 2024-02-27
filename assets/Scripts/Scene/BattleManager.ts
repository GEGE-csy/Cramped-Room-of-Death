import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../../Utils";
import Levels, { ILevel } from "../../Levels";
import DataManager from "../../Runtime/DataManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManager";
import EventManager from "../../Runtime/EventManager";
import {
	DIRECTION_ENUM,
	ENTITY_TYPE_ENUM,
	EVENT_ENUM,
	STATE_ENUM,
} from "../../Enums";
import { PlayerManager } from "../Player/PlayerManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { BurstManager } from "../Burst/BurstManager";
import { SpikesManager } from "../Spikes/SpikesManager";
import { SmokeManager } from "../Smoke/SmokeManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
	level: ILevel;
	stage: Node;
	// smoke 的层，防止遮挡住人
	private smokeLayer: Node = null;

	onLoad() {
		DataManager.Instance.levelIndex = 1;
		EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
		EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkOk, this);
		EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
	}

	onDestroy() {
		EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
		EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke);
	}

	start() {
		this.generateStage();
		this.initLevel();
	}

	initLevel() {
		const level = Levels[`level${DataManager.Instance.levelIndex}`];
		if (level) {
			this.clearLevel();
			this.level = level;
			// 将当前关卡信息存入数据中心
			DataManager.Instance.mapInfo = this.level.mapInfo;
			DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
			DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;
			this.generateTileMap();
			this.generateBursts();
			this.generateSpikes();
			this.generateEnemies();
			this.generateDoor();
			this.generateSmokeLayer();
			this.generatePlayer();
		}
	}

	nextLevel() {
		DataManager.Instance.levelIndex++;
		this.initLevel();
	}

	clearLevel() {
		this.stage.destroyAllChildren();
		DataManager.Instance.reset();
	}

	generateStage() {
		this.stage = createUINode();
		this.stage.setParent(this.node);
	}

	async generateTileMap() {
		const tileMap = createUINode();
		tileMap.setParent(this.stage);
		const tileMapManager = tileMap.addComponent(TileMapManager);
		await tileMapManager.init();

		this.adaptPosition();
	}

	async generatePlayer() {
		const player = createUINode();
		player.setParent(this.stage);
		const playerManager = player.addComponent(PlayerManager);
		await playerManager.init(this.level.player);
		DataManager.Instance.player = playerManager;
		// 敌人比玩家先渲染，需要触发事件让敌人改变方向面向玩家
		EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true);
	}

	async generateEnemies() {
		const promise = [];
		for (let i = 0; i < this.level.enemies.length; i++) {
			const enemy = this.level.enemies[i];
			const node = createUINode();
			node.setParent(this.stage);
			const type =
				enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN
					? WoodenSkeletonManager
					: IronSkeletonManager;
			const manager = node.addComponent(type);
			promise.push(manager.init(enemy));
			DataManager.Instance.enemies.push(manager);
		}
		await Promise.all(promise);
	}

	async generateBursts() {
		const promise = [];
		for (let i = 0; i < this.level.bursts.length; i++) {
			const burst = this.level.bursts[i];
			const node = createUINode();
			node.setParent(this.stage);
			const burstsManager = node.addComponent(BurstManager);
			promise.push(burstsManager.init(burst));
			DataManager.Instance.bursts.push(burstsManager);
		}
		await Promise.all(promise);
	}

	async generateDoor() {
		const door = createUINode();
		door.setParent(this.stage);
		const doorManager = door.addComponent(DoorManager);
		await doorManager.init(this.level.door);
		DataManager.Instance.door = doorManager;
	}

	async generateSpikes() {
		const promise = [];
		for (let i = 0; i < this.level.spikes.length; i++) {
			const spike = this.level.spikes[i];
			const node = createUINode();
			node.setParent(this.stage);
			const spikesManager = node.addComponent(SpikesManager);
			promise.push(spikesManager.init(spike));
			DataManager.Instance.spikes.push(spikesManager);
		}
		await Promise.all(promise);
	}

	async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    // 如果有状态为死亡的smoke，则改变其状态进行复用，避免一直生成smoke
		const deathSmoke = DataManager.Instance.smoke.find(
			s => s.state === STATE_ENUM.DEATH
		);
		if (deathSmoke) {
			deathSmoke.x = x;
			deathSmoke.y = y;
			deathSmoke.direction = direction;
      deathSmoke.state = STATE_ENUM.IDLE
			deathSmoke.node.setPosition(
				x * TILE_WIDTH - TILE_WIDTH * 1.5,
				-y * TILE_HEIGHT + TILE_HEIGHT * 1.5
			);
		} else {
			const smoke = createUINode();
			smoke.setParent(this.smokeLayer);
			const smokeManager = smoke.addComponent(SmokeManager);
			await smokeManager.init({
				x,
				y,
				direction,
				state: STATE_ENUM.IDLE,
				type: ENTITY_TYPE_ENUM.SMOKE,
			});
			DataManager.Instance.smoke.push(smokeManager);
		}
	}

	generateSmokeLayer() {
		this.smokeLayer = createUINode();
		this.smokeLayer.setParent(this.stage);
	}
	// 适配地图处于屏幕正中间
	adaptPosition() {
		const { mapRowCount, mapColumnCount } = DataManager.Instance;
		const distanceX = (TILE_WIDTH * mapRowCount) / 2;
		const distanceY = (TILE_HEIGHT * mapColumnCount) / 2 + 80;

		this.stage.setPosition(-distanceX, distanceY);
	}
	// 检查是否到达终点
	checkOk() {
		const { x: playerX, y: playerY } = DataManager.Instance.player;
		const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door;
		if (
			playerX === doorX &&
			playerY === doorY &&
			doorState === STATE_ENUM.DEATH
		) {
			EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);
		}
	}
}
