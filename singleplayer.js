// -------------------------
// 🎮 单人模式 - Wavelength
// -------------------------

// Firebase 配置（与多人模式共享）
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
let questionBank = null;
let currentQuestion = null;
let currentDifficulty = "easy";
let sessionId = generateSessionId();
let playerScore = 0;
let questionsAnswered = 0;
let startTime = null;

// -------------------------
// 🎯 游戏核心函数
// -------------------------

// 生成唯一会话ID
function generateSessionId() {
	return "sp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// 加载题库
async function loadQuestionBank() {
	try {
		const response = await fetch("question_bank.json");
		questionBank = await response.json();
		console.log("✅ 题库加载成功:", questionBank.total_questions, "道题");
	} catch (error) {
		console.error("❌ 题库加载失败:", error);
		alert("题库加载失败，请刷新页面重试！");
	}
}

// 开始游戏
async function startGame(difficulty = "easy") {
	if (!questionBank) {
		await loadQuestionBank();
	}

	currentDifficulty = difficulty;
	playerScore = 0;
	questionsAnswered = 0;
	sessionId = generateSessionId();

	// 隐藏难度选择，显示游戏区域
	document.getElementById("difficulty-selection").style.display = "none";
	document.getElementById("game-area").style.display = "block";
	document.getElementById("score-display").style.display = "block";

	loadNextQuestion();
}

// 加载下一题
function loadNextQuestion() {
	if (!questionBank) return;

	const questions = questionBank.questions[currentDifficulty];
	if (!questions || questions.length === 0) {
		alert("该难度没有题目！");
		return;
	}

	// 随机选择一道题
	currentQuestion = questions[Math.floor(Math.random() * questions.length)];
	startTime = Date.now();

	// 更新UI
	document.getElementById("left-label").innerText = currentQuestion.topic_pair.split(
		" ↔ "
	)[0];
	document.getElementById("right-label").innerText = currentQuestion.topic_pair.split(
		" ↔ "
	)[1];
	document.getElementById("question-text").innerText =
		currentQuestion.question_text;
	document.getElementById("guessSlider").value = 50;

	// 隐藏结果区域
	document.getElementById("result-section").style.display = "none";
	document.getElementById("guess-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "none";

	// 重绘画布
	drawArc(false, false);
}

// 提交猜测
function submitGuess() {
	const guess = parseInt(document.getElementById("guessSlider").value);
	const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);

	// 计算准确度
	const difference = Math.abs(guess - currentQuestion.target_position);
	const accuracyScore = Math.max(0, 100 - difference);

	// 判断结果
	let result = "";
	let scoreEarned = 0;

	const zoneSize = Math.floor(
		(currentQuestion.range_hint[1] - currentQuestion.range_hint[0]) / 3
	);
	const perfectStart = currentQuestion.range_hint[0] + zoneSize;
	const perfectEnd = currentQuestion.range_hint[1] - zoneSize;

	if (
		guess >= perfectStart &&
		guess <= perfectEnd &&
		guess >= currentQuestion.range_hint[0] &&
		guess <= currentQuestion.range_hint[1]
	) {
		result = "💯 完美命中！太神啦！";
		scoreEarned = 100;

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
	} else if (
		guess >= currentQuestion.range_hint[0] &&
		guess <= currentQuestion.range_hint[1]
	) {
		result = "✅ 不错！在合理范围内！";
		scoreEarned = 60;
	} else if (difference <= 20) {
		result = `😊 接近了！差了 ${difference} 分`;
		scoreEarned = 30;
	} else {
		result = `😢 没猜中！差距较大（${difference} 分）`;
		scoreEarned = 10;
	}

	playerScore += scoreEarned;
	questionsAnswered++;

	// 保存数据到Firebase
	saveGameData(guess, accuracyScore, timeTaken, null);

	// 显示结果
	displayResult(result, guess, scoreEarned);
}

// 显示结果
function displayResult(result, guess, scoreEarned) {
	document.getElementById("guess-section").style.display = "none";
	document.getElementById("result-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "block";

	document.getElementById("result-text").innerHTML = `
		<h2>${result}</h2>
		<p style="font-size: 18px; margin: 10px 0;">
			<strong>你的猜测：</strong>${guess}<br>
			<strong>正确位置：</strong>${currentQuestion.target_position}<br>
			<strong>合理范围：</strong>${currentQuestion.range_hint[0]} ~ ${currentQuestion.range_hint[1]}
		</p>
		<p style="font-size: 16px; color: #4a64f7;">
			<strong>本题得分：+${scoreEarned} 分</strong>
		</p>
	`;

	// 更新分数显示
	updateScoreDisplay();

	// 绘制带答案的画布
	drawArc(true, true, guess);
}

// 更新分数显示
function updateScoreDisplay() {
	document.getElementById("score-display").innerHTML = `
		📊 总分: <strong>${playerScore}</strong> |
		已答: <strong>${questionsAnswered}</strong> 题 |
		平均: <strong>${Math.round(
			playerScore / Math.max(1, questionsAnswered)
		)}</strong> 分/题
	`;
}

// 提交反馈
function submitFeedback(rating) {
	// 更新Firebase中的反馈
	const lastDataKey = sessionId + "_" + (questionsAnswered - 1);
	database.ref("singleplayer_feedback/" + lastDataKey).update({
		feedback_rating: rating,
		feedback_timestamp: new Date().toISOString(),
	});

	// 显示感谢消息
	const feedbackDiv = document.getElementById("feedback-survey");
	if (rating === "up") {
		feedbackDiv.innerHTML = '<p style="color: #4a64f7;">👍 感谢反馈！</p>';
	} else {
		feedbackDiv.innerHTML = '<p style="color: #ff6f00;">👎 感谢反馈，我们会改进！</p>';
	}

	setTimeout(() => {
		feedbackDiv.style.display = "none";
	}, 2000);
}

// 保存游戏数据到Firebase
function saveGameData(guess, accuracyScore, timeTaken, feedbackRating) {
	const dataKey = sessionId + "_" + questionsAnswered;

	database.ref("singleplayer_feedback/" + dataKey).set({
		question_id: currentQuestion.id,
		question_text: currentQuestion.question_text,
		topic_pair: currentQuestion.topic_pair,
		difficulty: currentDifficulty,
		player_guess: guess,
		target_position: currentQuestion.target_position,
		accuracy_score: accuracyScore,
		time_taken_seconds: parseFloat(timeTaken),
		score_earned: playerScore,
		feedback_rating: feedbackRating,
		timestamp: new Date().toISOString(),
		session_id: sessionId,
	});
}

// 切换难度
function changeDifficulty(difficulty) {
	// 确认切换
	if (questionsAnswered > 0) {
		const confirmChange = confirm(
			`当前已答 ${questionsAnswered} 题，切换难度将重置分数。确定要切换吗？`
		);
		if (!confirmChange) return;
	}

	currentDifficulty = difficulty;
	playerScore = 0;
	questionsAnswered = 0;
	sessionId = generateSessionId();

	// 更新难度按钮样式
	document.querySelectorAll(".difficulty-btn").forEach((btn) => {
		btn.classList.remove("active");
	});
	document.getElementById("diff-" + difficulty).classList.add("active");

	loadNextQuestion();
	updateScoreDisplay();
}

// 返回主菜单
function backToMenu() {
	const confirmBack = confirm(
		`当前分数 ${playerScore}，已答 ${questionsAnswered} 题。确定要返回主菜单吗？`
	);
	if (!confirmBack) return;

	document.getElementById("difficulty-selection").style.display = "block";
	document.getElementById("game-area").style.display = "none";
	document.getElementById("score-display").style.display = "none";
}

// -------------------------
// 🖌️ 画图函数
// -------------------------
const arcCanvas = document.getElementById("arcCanvas");
const ctx = arcCanvas.getContext("2d");

function drawArc(showTarget = false, showGuess = false, guessValue = null) {
	ctx.clearRect(0, 0, arcCanvas.width, arcCanvas.height);
	const cx = arcCanvas.width / 2,
		cy = arcCanvas.height - 20,
		r = 180;

	// 绘制基础弧线
	ctx.beginPath();
	ctx.arc(cx, cy, r, Math.PI, 0);
	ctx.strokeStyle = "#333";
	ctx.lineWidth = 3;
	ctx.stroke();

	// 显示目标区域
	if (showTarget && currentQuestion) {
		const rangeStart = currentQuestion.range_hint[0];
		const rangeEnd = currentQuestion.range_hint[1];
		const zoneSize = Math.floor((rangeEnd - rangeStart) / 3);

		const zones = [
			{
				start: rangeStart,
				end: rangeStart + zoneSize,
				color: "rgba(144,238,144,0.6)",
			},
			{
				start: rangeStart + zoneSize,
				end: rangeEnd - zoneSize,
				color: "rgba(34,139,34,0.7)",
			},
			{
				start: rangeEnd - zoneSize,
				end: rangeEnd,
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

		// 绘制正确答案位置（金色星星）
		const targetAngle =
			Math.PI + Math.PI * (currentQuestion.target_position / 100);
		const targetX = cx + r * Math.cos(targetAngle);
		const targetY = cy + r * Math.sin(targetAngle);

		ctx.beginPath();
		ctx.arc(targetX, targetY, 8, 0, 2 * Math.PI);
		ctx.fillStyle = "gold";
		ctx.fill();
		ctx.strokeStyle = "orange";
		ctx.lineWidth = 2;
		ctx.stroke();
	}

	// 显示玩家猜测
	if (showGuess && guessValue !== null) {
		const angle = Math.PI + Math.PI * (guessValue / 100);
		const x = cx + r * Math.cos(angle);
		const y = cy + r * Math.sin(angle);
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
	}
}

// -------------------------
// 🎯 交互事件
// -------------------------

// 滑条实时更新
document.getElementById("guessSlider").addEventListener("input", () => {
	const value = parseInt(document.getElementById("guessSlider").value);
	drawArc(false, true, value);
});

// 点击画布设置猜测
arcCanvas.addEventListener("click", (e) => {
	if (document.getElementById("guess-section").style.display === "none") return;

	const rect = arcCanvas.getBoundingClientRect();
	const cx = arcCanvas.width / 2,
		cy = arcCanvas.height - 20;
	const dx = e.clientX - rect.left - cx;
	const dy = e.clientY - rect.top - cy;
	const angle = Math.atan2(dy, dx);

	if (angle >= Math.PI - 0.2 && angle <= 2 * Math.PI + 0.2) {
		let guessPercent = ((angle - Math.PI) / Math.PI) * 100;
		guessPercent = Math.max(0, Math.min(100, guessPercent));
		document.getElementById("guessSlider").value = Math.round(guessPercent);
		drawArc(false, true, guessPercent);
	}
});

// -------------------------
// 🚀 页面加载时初始化
// -------------------------
window.addEventListener("DOMContentLoaded", () => {
	loadQuestionBank();
	drawArc(false, false);
});
