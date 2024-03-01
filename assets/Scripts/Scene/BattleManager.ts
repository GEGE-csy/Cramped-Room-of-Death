import { _decorator, Color, Component, director, Label, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode, local } from "../../Utils";
import Levels, { ILevel } from "../../Levels";
import DataManager, { IRecord } from "../../Runtime/DataManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManager";
import EventManager from "../../Runtime/EventManager";
import {
	DIRECTION_ENUM,
	ENTITY_TYPE_ENUM,
	EVENT_ENUM,
	SCENE_ENUM,
	STATE_ENUM,
} from "../../Enums";
import { PlayerManager } from "../Player/PlayerManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { BurstManager } from "../Burst/BurstManager";
import { SpikesManager } from "../Spikes/SpikesManager";
import { SmokeManager } from "../Smoke/SmokeManager";
import { ShakeManager } from "../UI/ShakeManager";
import FadeManager from "../../Runtime/FadeManager";
import { DialogManager } from "./DialogManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
	level: ILevel;
	stage: Node;
	// smoke 的层，防止遮挡住人
	private smokeLayer: Node = null;
	private initd = false;
	onLoad() {
		EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
		EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkOk, this);
		EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
		EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this);
		EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
		EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this);
		EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this);
		EventManager.Instance.on(EVENT_ENUM.GAME_OVER, this.gameOver, this);
    EventManager.Instance.on(EVENT_ENUM.WIN, this.winGame, this);
	}

	onDestroy() {
		EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
		EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkOk);
		EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke);
		EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record);
		EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke);
		EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel);
		EventManager.Instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle);
		EventManager.Instance.off(EVENT_ENUM.GAME_OVER, this.gameOver);
    EventManager.Instance.off(EVENT_ENUM.WIN, this.winGame);
	}

	start() {
    const level = local.get("levelIndex")
    if(level) {
      DataManager.Instance.levelIndex = level
    } else {
      DataManager.Instance.levelIndex = 1
      local.set("levelIndex", 1)
    }
		this.generateStage();
		this.initLevel();
	}
	async initLevel() {
    const levelIndex = local.get("levelIndex")
    if(levelIndex) {
      DataManager.Instance.levelIndex = levelIndex
    } else {
      DataManager.Instance.levelIndex = 1
      local.set("levelIndex", 1)
    }
		let level = Levels[`level${levelIndex}`];
		if (level) {
			if (this.initd) {
				await FadeManager.Instance.fadeIn();
			} else {
				await FadeManager.Instance.mask();
			}
			this.clearLevel();
			this.level = level;
			// 将当前关卡信息存入数据中心
			DataManager.Instance.mapInfo = this.level.mapInfo;
			DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
			DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;

			await Promise.all([
				this.generateTileMap(),
				this.generateBursts(),
				this.generateSpikes(),
				this.generateEnemies(),
				this.generateDoor(),
				this.generateSmokeLayer(),
				this.generatePlayer(),
			]);
			await FadeManager.Instance.fadeOut();
			this.initd = true;
			this.generateLevelTitle();
		}
	}

  async winGame() {
    director.loadScene(SCENE_ENUM.WIN);
  }

	async outBattle() {
		await FadeManager.Instance.fadeIn();
		director.loadScene(SCENE_ENUM.Start);
	}

	async gameOver() {
		setTimeout(() => {
			director.loadScene(SCENE_ENUM.GAME_OVER);
		}, 1500);
	}

	nextLevel() {
		DataManager.Instance.levelIndex++;
		local.set("levelIndex", DataManager.Instance.levelIndex);
		this.initLevel();
	}

	clearLevel() {
		this.stage.destroyAllChildren();
		DataManager.Instance.reset();
	}

	generateStage() {
		this.stage = createUINode();
		this.stage.setParent(this.node);
		this.stage.addComponent(ShakeManager);
	}

	generateLevelTitle() {
    const labelNode = this.node.children.find(item => item.name === 'Label')
    const label = labelNode.getComponent(Label)
    label.string = `LEVEL ${DataManager.Instance.levelIndex}`;
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
			deathSmoke.state = STATE_ENUM.IDLE;
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

	async generateSmokeLayer() {
		this.smokeLayer = createUINode();
		this.smokeLayer.setParent(this.stage);
	}
	// 适配地图处于屏幕正中间
	adaptPosition() {
		const { mapRowCount, mapColumnCount } = DataManager.Instance;
		const distanceX = (TILE_WIDTH * mapRowCount) / 2;
		const distanceY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

		this.stage.getComponent(ShakeManager).stop();
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
      if(DataManager.Instance.levelIndex === 15) {
        EventManager.Instance.emit(EVENT_ENUM.WIN);
      } else {
        EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);
      }
		}
	}

	record() {
		const item: IRecord = {
			player: {
				x: DataManager.Instance.player.targetX,
				y: DataManager.Instance.player.targetY,
				state:
					DataManager.Instance.player.state === STATE_ENUM.IDLE ||
					DataManager.Instance.player.state === STATE_ENUM.DEATH ||
					DataManager.Instance.player.state === STATE_ENUM.AIR_DEATH
						? DataManager.Instance.player.state
						: STATE_ENUM.IDLE,
				direction: DataManager.Instance.player.direction,
				type: DataManager.Instance.player.type,
			},
			door: {
				x: DataManager.Instance.door.x,
				y: DataManager.Instance.door.y,
				state: DataManager.Instance.door.state,
				direction: DataManager.Instance.door.direction,
				type: DataManager.Instance.door.type,
			},
			enemies: DataManager.Instance.enemies.map(
				({ x, y, direction, state, type }) => ({ x, y, direction, state, type })
			),
			spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => ({
				x,
				y,
				count,
				type,
			})),
			bursts: DataManager.Instance.bursts.map(
				({ x, y, direction, state, type }) => ({ x, y, direction, state, type })
			),
		};
		DataManager.Instance.records.push(item);
	}

	revoke() {
		const data = DataManager.Instance.records.pop();
		if (data) {
			DataManager.Instance.player.x = DataManager.Instance.player.targetX =
				data.player.x;
			DataManager.Instance.player.y = DataManager.Instance.player.targetY =
				data.player.y;
			DataManager.Instance.player.state = data.player.state;
			DataManager.Instance.player.direction = data.player.direction;

			for (let i = 0; i < data.enemies.length; i++) {
				const item = data.enemies[i];
				DataManager.Instance.enemies[i].x = item.x;
				DataManager.Instance.enemies[i].y = item.y;
				DataManager.Instance.enemies[i].state = item.state;
				DataManager.Instance.enemies[i].direction = item.direction;
			}

			for (let i = 0; i < data.spikes.length; i++) {
				const item = data.spikes[i];
				DataManager.Instance.spikes[i].x = item.x;
				DataManager.Instance.spikes[i].y = item.y;
				DataManager.Instance.spikes[i].count = item.count;
			}

			for (let i = 0; i < data.bursts.length; i++) {
				const item = data.bursts[i];
				DataManager.Instance.bursts[i].x = item.x;
				DataManager.Instance.bursts[i].y = item.y;
				DataManager.Instance.bursts[i].state = item.state;
			}

			DataManager.Instance.door.x = data.door.x;
			DataManager.Instance.door.y = data.door.y;
			DataManager.Instance.door.state = data.door.state;
			DataManager.Instance.door.direction = data.door.direction;
		}
	}
}
