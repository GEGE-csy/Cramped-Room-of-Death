import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../../Utils";
import Levels, { ILevel } from "../../Levels";
import DataManager from "../../Runtime/DataManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManager";
import EventManager from "../../Runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, STATE_ENUM } from "../../Enums";
import { PlayerManager } from "../Player/PlayerManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { BurstManager } from "../Burst/BurstManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
	level: ILevel;
	stage: Node;

	onLoad() {
		EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
	}

	onDestroy() {
		EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
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
			this.generatePlayer();
			// this.generateEnemies();
      this.generateDoor()
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
  async generateBursts() {
		const bursts = createUINode();
		bursts.setParent(this.stage);
		const burstManager = bursts.addComponent(BurstManager);
		await burstManager.init({
      x: 2,
      y: 3,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.BURSTS
    });
    
    
    DataManager.Instance.bursts.push(burstManager)
    console.log(DataManager.Instance.bursts);
	}

 
	async generatePlayer() {
		const player = createUINode();
		player.setParent(this.stage);
		const playerManager = player.addComponent(PlayerManager);
		await playerManager.init({
      x: 2,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER
    });
    DataManager.Instance.player = playerManager
    // 敌人比玩家先渲染，需要触发事件让敌人改变方向面向玩家
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
	}

	async generateEnemies() {
		const enemy = createUINode();
		enemy.setParent(this.stage);
		const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager);
		await woodenSkeletonManager.init({
      x: 2,
      y: 4,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN
    });
    DataManager.Instance.enemies.push(woodenSkeletonManager)

    const enemy2 = createUINode();
		enemy2.setParent(this.stage);
		const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager);
		await ironSkeletonManager.init({
      x: 2,
      y: 2,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SKELETON_IRON
    });
    DataManager.Instance.enemies.push(ironSkeletonManager)
	}

  async generateDoor() {
    const door = createUINode();
		door.setParent(this.stage);
		const doorManager = door.addComponent(DoorManager);
		await doorManager.init({
      x: 7,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.DOOR
    });
    DataManager.Instance.door = doorManager
  }
	// 适配地图处于屏幕正中间
	adaptPosition() {
		const { mapRowCount, mapColumnCount } = DataManager.Instance;
		const distanceX = (TILE_WIDTH * mapRowCount) / 2;
		const distanceY = (TILE_HEIGHT * mapColumnCount) / 2 + 80;

		this.stage.setPosition(-distanceX, distanceY);
	}
}
