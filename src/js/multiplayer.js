// -------------------------
// 🔧 Firebase 初始化
// -------------------------
const firebaseConfig = {
	apiKey: "AIzaSyC2FBVzS2LP-cX_lpMrBX_3xSikz9u-YYI",
	authDomain: "wavelength-58ccd.firebaseapp.com",
	databaseURL: "https://wavelength-58ccd-default-rtdb.firebaseio.com",
	projectId: "wavelength-58ccd",
	storageBucket: "wavelength-58ccd.firebasestorage.app",
	messagingSenderId: "942333085121",
	appId: "1:942333085121:web:2d21b3c00a14f5b5941b40",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// -------------------------
// 🧠 状态变量
// -------------------------
let currentRoomId = null;
let playerRole = null; // 'host' 或 'guest'
let targetStart = 0,
	targetEnd = 0;
let topic = {};
let guessPercent = null;
let currentTurn = "host"; // host 先出题

let lastGuessValue = 50;
let lastTickPlayTime = 0;
const MIN_TICK_INTERVAL = 40;
let moveSounds = [];
let moveSoundIndex = 0;

// ⏰ 时间设置变量
let hintTimeLimit = 30;
let guessTimeLimit = 15;

// 词库变量
let chineseWordBank = [];
let hintList = [];

// ✅ 等待 DOM 加载完再获取音效标签和加载词库
window.addEventListener("DOMContentLoaded", () => {
	moveSounds = [
		document.getElementById("moveSound0"),
		document.getElementById("moveSound1"),
		document.getElementById("moveSound2"),
		document.getElementById("moveSound3"),
		document.getElementById("moveSound4"),
	];

	// 加载词库和提示列表
	loadWordBank();
	loadHintList();
});

// 加载词库函数
async function loadWordBank() {
	try {
		const response = await fetch('../data/wordbank.json');
		const data = await response.json();
		chineseWordBank = data.words;
		console.log('✅ 词库加载成功:', chineseWordBank.length, '个词');
	} catch (error) {
		console.error('❌ 词库加载失败:', error);
		// 如果加载失败，使用备用词库
		chineseWordBank = ["火锅", "宇宙", "爱情", "梦境", "沙发"];
	}
}

// 加载提示列表函数
async function loadHintList() {
	try {
		const response = await fetch('../data/hintlist.json');
		const data = await response.json();
		hintList = data.hints;
		console.log('✅ 提示列表加载成功:', hintList.length, '对提示');
	} catch (error) {
		console.error('❌ 提示列表加载失败:', error);
		// 如果加载失败，使用备用提示列表
		hintList = [
			{ left: "冷", right: "热" },
			{ left: "好吃", right: "难吃" },
			{ left: "开心", right: "难过" }
		];
	}
}

// ⏰ 更新时间显示和配置
function updateTimeDisplay(type) {
	if (type === "hint") {
		const value = document.getElementById("hintTime").value;
		hintTimeLimit = parseInt(value);
		document.getElementById("hintTimeDisplay").textContent = value + t('seconds');

		// 同步到 Firebase（只有房主需要同步）
		if (playerRole === "host" && currentRoomId) {
			database.ref("rooms/" + currentRoomId + "/timeSettings").update({
				hintTime: hintTimeLimit,
			});
		}
	} else if (type === "guess") {
		const value = document.getElementById("guessTime").value;
		guessTimeLimit = parseInt(value);
		document.getElementById("guessTimeDisplay").textContent = value + t('seconds');

		// 同步到 Firebase（只有房主需要同步）
		if (playerRole === "host" && currentRoomId) {
			database.ref("rooms/" + currentRoomId + "/timeSettings").update({
				guessTime: guessTimeLimit,
			});
		}
	}
}

// -------------------------
// 🖌️ 画图函数
// -------------------------
const arcCanvas = document.getElementById("arcCanvas");
const ctx = arcCanvas.getContext("2d");

function drawArc(showTarget = false, showGuess = false) {
	ctx.clearRect(0, 0, arcCanvas.width, arcCanvas.height);
	const cx = arcCanvas.width / 2,
		cy = arcCanvas.height - 20,
		r = 180;

	ctx.beginPath();
	ctx.arc(cx, cy, r, Math.PI, 0);
	ctx.strokeStyle = "#333";
	ctx.lineWidth = 3;
	ctx.stroke();

	if (showTarget) {
		const zoneSize = Math.floor((targetEnd - targetStart) / 3);
		const zones = [
			{
				start: targetStart,
				end: targetStart + zoneSize,
				color: "rgba(144,238,144,0.6)",
			},
			{
				start: targetStart + zoneSize,
				end: targetEnd - zoneSize,
				color: "rgba(34,139,34,0.7)",
			},
			{
				start: targetEnd - zoneSize,
				end: targetEnd,
				color: "rgba(144,238,144,0.6)",
			},
		];
		for (let zone of zones) {
			const startAngle = Math.PI + Math.PI * (zone.start / 100);
			const endAngle = Math.PI + Math.PI * (zone.end / 100);
			ctx.beginPath();
			ctx.arc(cx, cy, r, startAngle, endAngle);
			ctx.strokeStyle = zone.color;
			ctx.lineWidth = 20;
			ctx.stroke();
		}
	}

	if (showGuess) {
		const percent =
			guessPercent ?? parseInt(document.getElementById("guessSlider").value);
		const angle = Math.PI + Math.PI * (percent / 100);
		const x = cx + r * Math.cos(angle);
		const y = cy + r * Math.sin(angle);
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
	}
}

// -------------------------
// 🏠 房主函数
// -------------------------
function createRoom() {
	currentRoomId = Math.floor(100 + Math.random() * 900).toString();
	playerRole = "host";
	database.ref("rooms/" + currentRoomId).set({
		host: true,
		gameState: "waiting",
		timeSettings: {
			hintTime: hintTimeLimit,
			guessTime: guessTimeLimit,
		},
	});
	document.getElementById("connection-status").textContent =
		"✅ 房间已创建：" + currentRoomId;
	startListening();
	document.getElementById("game-step").innerText = "等待玩家加入...";

	// ⏰ 显示时间设置面板（只有房主可见）
	document.getElementById("time-settings").style.display = "block";

	// 在房主创建房间后注册监听
	window.addEventListener("beforeunload", function () {
		// 只有房主有权删除房间
		if (playerRole === "host" && currentRoomId) {
			database.ref("rooms/" + currentRoomId).remove();
		}
	});
}

function hostStartGame() {
	topic = hintList[Math.floor(Math.random() * hintList.length)];
	targetStart = Math.floor(Math.random() * 60);
	targetEnd = targetStart + 30;

	database.ref("rooms/" + currentRoomId).update({
		gameState: "hintPhase",
		target: {
			start: targetStart,
			end: targetEnd,
			left: topic.left,
			right: topic.right,
		},
		currentTurn: currentTurn,
		phaseStartTime: Date.now(),
	});

	const leftLabel = document.getElementById("left-label");
	const rightLabel = document.getElementById("right-label");
	const hintInput = document.getElementById("hint-input");
	const startGameBtn = document.getElementById("startGameBtn");
	const gameStep = document.getElementById("game-step");
	const timeSettings = document.getElementById("time-settings");

	if (leftLabel) leftLabel.innerText = topic.left;
	if (rightLabel) rightLabel.innerText = topic.right;
	if (hintInput) hintInput.style.display = "block";
	drawArc(true);
	if (startGameBtn) startGameBtn.style.display = "none";
	if (gameStep) gameStep.innerText = "请输入提示词...";

	// ⏰ 游戏开始后隐藏时间设置面板
	if (timeSettings) timeSettings.style.display = "none";
}

function confirmHint(countdown = false) {
	clearInterval(countdownInterval);
	document.getElementById("countdown").style.display = "none";

	if (countdown) {
		const word =
			chineseWordBank[Math.floor(Math.random() * chineseWordBank.length)];
		document.getElementById("hintBox").value = word;
	}
	const hint = document.getElementById("hintBox").value.trim();
	if (!hint) return alert("请输入提示词！");
	database.ref("rooms/" + currentRoomId).update({
		currentHint: hint,
		gameState: "guessPhase",
		showTarget: false,
		phaseStartTime: Date.now(),
	});
	document.getElementById("hint-input").style.display = "none";
	document.getElementById("game-step").innerText =
		"等待对方猜测...  提示词为: " + hint;
	if (countdown) {
		alert("⏰ 时间到！你没能及时出题！系统随机生成了提示词：" + hint);
	}
}

// -------------------------
// 👤 玩家函数
// -------------------------
function joinRoom() {
	currentRoomId = document.getElementById("roomId").value.trim();
	if (!currentRoomId) return alert("请输入房间号");

	// 🔍 检查房间是否存在并且有效
	database
		.ref("rooms/" + currentRoomId)
		.once("value")
		.then((snapshot) => {
			const roomData = snapshot.val();

			// 检查房间是否存在且有房主
			if (!snapshot.exists() || !roomData || !roomData.host) {
				alert("❌ 房间不存在，请检查房间号是否正确");
				currentRoomId = null;
				return;
			}

			// 检查房间是否已经有客人了
			if (roomData.guest) {
				alert("❌ 房间已满，无法加入");
				currentRoomId = null;
				return;
			}

			// 房间存在且有效，继续加入
			playerRole = "guest";
			database.ref("rooms/" + currentRoomId).update({ guest: true });
			document.getElementById("connection-status").textContent =
				"✅ 已加入房间";
			startListening();
		})
		.catch((error) => {
			alert("连接失败：" + error.message);
			currentRoomId = null;
		});
}

function submitGuess(countdown = false) {
	clearInterval(countdownInterval);
	document.getElementById("countdown").style.display = "none";

	if (countdown) {
		document.getElementById("guessSlider").value = Math.floor(
			Math.random() * 100
		);
	}
	const guess = parseInt(document.getElementById("guessSlider").value);
	guessPercent = guess;

	const zoneSize = Math.floor((targetEnd - targetStart) / 3);
	const perfectStart = targetStart + zoneSize;
	const perfectEnd = targetEnd - zoneSize;

	let result = "";
	if (guess >= perfectStart && guess <= perfectEnd) {
		result = "💯 完美命中！太神啦！";

		// 🎉 视觉礼炮特效
		confetti({
			particleCount: 100,
			spread: 80,
			origin: { y: 0.6 },
		});

		// 🔊 播放音效
		const celebrateSound = document.getElementById("celebrateSound");
		celebrateSound.currentTime = 0;
		celebrateSound.play();
	} else if (guess >= targetStart && guess <= targetEnd) {
		result = "✅ 猜中了范围！不错！";
	} else {
		result = `😢 没猜中！正确范围是 ${targetStart} ~ ${targetEnd}`;
	}

	document.getElementById("guess-section").style.display = "none";
	document.getElementById("game-step").innerText = "";

	database.ref("rooms/" + currentRoomId).update({
		guessResult: {
			value: guess,
			start: targetStart,
			end: targetEnd,
			feedback: result,
		},
		gameState: "resultPhase",
		showTarget: true,
		showGuess: true,
		liveGuess: guess,
		updatedAt: Date.now(),
	});

	if (countdown) {
		alert(
			"⏰ 时间到！你没能及时猜测！系统随机生成了猜测值：" +
				document.getElementById("guessSlider").value
		);
	}
}

function nextRound() {
	resetUI();
	currentTurn = currentTurn === "host" ? "guest" : "host";

	database
		.ref("rooms/" + currentRoomId)
		.update({
			gameState: "waiting",
			showTarget: false,
			showGuess: false,
			currentHint: "",
			guessResult: null,
			liveGuess: null,
			currentTurn: currentTurn,
		})
		.then(() => {
			// ✅ 更新完 Firebase 后，判断是不是自己出题
			if (currentTurn === playerRole) {
				hostStartGame();
			}
		});
}

function resetUI() {
	// 清除提示词和结果
	document.getElementById("hintBox").value = "";
	document.getElementById("hint").innerText = "（等待提示）";
	document.getElementById("result").innerText = "";

	// 隐藏输入/猜测区域
	document.getElementById("hint-input").style.display = "none";
	document.getElementById("guess-section").style.display = "none";

	// 隐藏下一轮按钮
	document.getElementById("nextRoundBtn").style.display = "none";

	// 重置进度提示
	document.getElementById("game-step").innerText = "等待开始新一轮...";

	// 清除红点
	guessPercent = null;

	// 重绘画布（无目标、无指针）
	drawArc(false, false);
}

// 倒计时函数
let countdownInterval;

function startCountdown(startTime, durationInSeconds) {
	clearInterval(countdownInterval);
	const countdownEl = document.getElementById("countdown");
	countdownEl.style.display = "block";

	countdownInterval = setInterval(() => {
		const now = Date.now();
		const secondsPassed = Math.floor((now - startTime) / 1000);
		const secondsLeft = Math.max(0, durationInSeconds - secondsPassed);
		countdownEl.textContent = `⏳ 剩余时间：${secondsLeft} 秒`;

		if (secondsLeft <= 0) {
			clearInterval(countdownInterval);
			handleTimeout();
		}
	}, 500);
}

function handleTimeout() {
	if (document.getElementById("hint-input").style.display !== "none") {
		confirmHint(true);
	} else if (
		document.getElementById("guess-section").style.display !== "none"
	) {
		submitGuess(true);
	}
}

// -------------------------
// 🔄 数据监听
// -------------------------
function startListening() {
	const roomRef = database.ref("rooms/" + currentRoomId);
	roomRef.on("value", (snapshot) => {
		const data = snapshot.val();
		if (!data) return;

		// ⏰ 监听时间设置的变化（同步房主的设置）
		if (data.timeSettings) {
			if (data.timeSettings.hintTime !== undefined) {
				hintTimeLimit = data.timeSettings.hintTime;
			}
			if (data.timeSettings.guessTime !== undefined) {
				guessTimeLimit = data.timeSettings.guessTime;
			}
		}

		if (!data.target && data.guest && playerRole === "host") {
			const gameStep = document.getElementById("game-step");
			const startGameBtn = document.getElementById("startGameBtn");
			if (gameStep) gameStep.innerText = "玩家已加入，点击开始游戏！";
			if (startGameBtn) startGameBtn.style.display = "block";
		}

		if (data.gameState === "hintPhase" && data.target) {
			targetStart = data.target.start;
			targetEnd = data.target.end;
			topic = { left: data.target.left, right: data.target.right };

			const leftLabel = document.getElementById("left-label");
			const rightLabel = document.getElementById("right-label");
			if (leftLabel) leftLabel.innerText = topic.left;
			if (rightLabel) rightLabel.innerText = topic.right;
		}

		if (data.liveGuess !== undefined && data.liveGuess !== null) {
			guessPercent = data.liveGuess;
		}

		drawArc(data.showTarget, data.showGuess || data.liveGuess !== undefined);

		if (data.gameState === "hintPhase") {
			if (playerRole === data.currentTurn) {
				const hintInput = document.getElementById("hint-input");
				if (hintInput) hintInput.style.display = "block";

				drawArc(true);
				startCountdown(data.phaseStartTime, hintTimeLimit);
			} else {
				const guessSection = document.getElementById("guess-section");
				if (guessSection) guessSection.style.display = "none";
			}
		}

		if (data.gameState === "guessPhase") {
			if (playerRole !== data.currentTurn) {
				const hintElem = document.getElementById("hint");
				const guessSection = document.getElementById("guess-section");
				const gameStep = document.getElementById("game-step");

				if (hintElem) hintElem.innerText = data.currentHint;
				if (guessSection) guessSection.style.display = "block";
				if (gameStep) gameStep.innerText = "";

				startCountdown(data.phaseStartTime, guessTimeLimit);
			}
		}

		if (data.gameState === "resultPhase") {
			const resultElem = document.getElementById("result");
			const nextRoundBtn = document.getElementById("nextRoundBtn");
			const gameStep = document.getElementById("game-step");

			if (resultElem) resultElem.innerText = data.guessResult.feedback;
			if (currentTurn !== playerRole) {
				if (nextRoundBtn) nextRoundBtn.style.display = "block";
			} else {
				if (gameStep) gameStep.innerText = "";
			}
		}

		if (data.gameState === "waiting") {
			if (data.currentTurn) {
				currentTurn = data.currentTurn;
			}
			if (currentTurn !== playerRole && data.target) {
				resetUI();
				const gameStep = document.getElementById("game-step");
				if (gameStep) gameStep.innerText = "🕐 等待对方输入提示词...";
			}
		}
	});
}

// -------------------------
// 🎯 弧线点击设置猜测 & 实时同步
// -------------------------
arcCanvas.addEventListener("mousedown", (e) => {
	if (document.getElementById("guess-section").style.display === "none") return;
	const rect = arcCanvas.getBoundingClientRect();
	const cx = arcCanvas.width / 2,
		cy = arcCanvas.height - 20;
	const dx = e.clientX - rect.left - cx;
	const dy = e.clientY - rect.top - cy;
	const angle = Math.atan2(dy, dx);
	if (angle >= Math.PI && angle <= 2 * Math.PI) {
		guessPercent = ((angle - Math.PI) / Math.PI) * 100;
		drawArc(false, true);
		database.ref("rooms/" + currentRoomId).update({ liveGuess: guessPercent });
	}
});

document.getElementById("guessSlider").addEventListener("input", () => {
	const slider = document.getElementById("guessSlider");
	const newValue = parseInt(slider.value);

	const now = Date.now();
	const diff = Math.abs(newValue - lastGuessValue);

	if (diff > 0 && now - lastTickPlayTime > MIN_TICK_INTERVAL) {
		// ✅ 播放一次 tick 声音（用音效池）
		const sound = moveSounds[moveSoundIndex];
		sound.currentTime = 0;
		sound.play();
		moveSoundIndex = (moveSoundIndex + 1) % moveSounds.length;
		lastTickPlayTime = now; // ✅ 更新上次播放时间
	}

	lastGuessValue = newValue;

	if (document.getElementById("guess-section").style.display !== "none") {
		guessPercent = newValue;
		drawArc(false, true);
		database.ref("rooms/" + currentRoomId).update({ liveGuess: guessPercent });
	}
});

// -------------------------
// ⌨️ Enter 键提交支持
// -------------------------
// 房间号输入框按 Enter 加入房间
document.getElementById("roomId").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		joinRoom();
	}
});

// 提示词输入框按 Enter 确认提示
document.getElementById("hintBox").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		confirmHint();
	}
});
