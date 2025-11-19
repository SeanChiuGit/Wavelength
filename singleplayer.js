// -------------------------
// 🎮 单人模式 - Wavelength (简化版)
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
let currentCreator = "Sean";
let sessionId = generateSessionId();
let startTime = null;
let isCreatorMode = false; // 是否处于"我也来出题"模式
let creatorModeQuestions = []; // 存储玩家未见过的题目
let creatorName = ""; // 玩家出题者名字
let createdQuestionsCount = 0; // 已出题数量
const MAX_CREATOR_QUESTIONS = 3; // 最多出3道题

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

// 获取多语言文本（支持对象）
function getLocalizedText(textObj) {
	if (typeof textObj === 'string') return textObj;
	return textObj[currentLang] || textObj['zh'] || textObj['en'] || '';
}

// 开始游戏
async function startGame(creator = "Sean") {
	if (!questionBank) {
		await loadQuestionBank();
	}

	currentCreator = creator;
	sessionId = generateSessionId();
	isCreatorMode = false;

	// 隐藏出题者选择，显示游戏区域
	document.getElementById("creator-selection").style.display = "none";
	document.getElementById("game-area").style.display = "block";
	document.getElementById("creator-controls").style.display = "none"; // 隐藏切换按钮

	// 如果是玩家题库，从 Firebase 加载
	if (creator === "Players") {
		loadPlayerQuestions();
	} else {
		// 显示创作者描述
		const creatorInfo = questionBank.creators[creator];
		const creatorDesc = getLocalizedText(creatorInfo.description);
		document.getElementById("current-creator").innerText = `${t('creatorLabel')}${creator}`;
		document.getElementById("game-subtitle").innerHTML =
			`<span style="color: #999; font-size: 14px;">${creatorDesc}</span><br>${t('guessWhat')} 🤔`;

		loadNormalQuestion();
	}
}

// 加载玩家题库
async function loadPlayerQuestions() {
	document.getElementById("current-creator").innerText = `${t('creatorLabel')}${t('playerBank')}`;
	document.getElementById("game-subtitle").innerText = `${t('guessPlayers')} 🎮`;
	document.getElementById("creator-controls").style.display = "none";

	try {
		const snapshot = await database.ref("player_questions").once("value");
		const data = snapshot.val();

		if (!data || Object.keys(data).length === 0) {
			alert(t('noPlayerQuestions'));
			backToMenu();
			return;
		}

		// 转换为数组
		const playerQuestions = Object.values(data);

		// 随机选择一道题
		currentQuestion = playerQuestions[Math.floor(Math.random() * playerQuestions.length)];
		startTime = Date.now();

		// 更新UI - 使用多语言文本
		const topicPairText = getLocalizedText(currentQuestion.topic_pair);
		const topicParts = topicPairText.split(" ↔ ");
		document.getElementById("left-label").innerText = topicParts[0];
		document.getElementById("right-label").innerText = topicParts[1];

		// 显示题目和评价统计
		const questionText = getLocalizedText(currentQuestion.question_text);
		const voteStats = await displayQuestionVotes(currentQuestion.id);
		document.getElementById("question-text").innerHTML = questionText + voteStats;

		// 显示玩家出题者名字（普通黑色加粗）
		document.getElementById("current-creator").innerHTML =
			`${t('creatorLabel')}<strong style="color: #333;">${currentQuestion.question_creator}</strong>`;

		document.getElementById("guessSlider").value = 50;
		document.getElementById("result-section").style.display = "none";
		document.getElementById("guess-section").style.display = "block";
		document.getElementById("feedback-survey").style.display = "none";

		drawArc(false, false);
	} catch (error) {
		console.error("加载玩家题库失败:", error);
		alert(t('loadFailed'));
		backToMenu();
	}
}

// 这些函数现在在文件末尾定义

// 显示结果
function displayResult(emoji, result, guess) {
	document.getElementById("guess-section").style.display = "none";
	document.getElementById("result-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "block";

	// 简化的结果显示
	document.getElementById("result-text").innerHTML = `
		<h1 style="font-size: 48px; margin: 20px 0;">${emoji}</h1>
		<h2 style="margin: 10px 0;">${result}</h2>
	`;

	// 绘制带答案的画布
	drawArc(true, true, guess);
}

// 提交反馈
function submitFeedback(rating) {
	// 更新Firebase中的反馈
	const dataKey = sessionId + "_" + Date.now();
	database.ref("singleplayer_feedback/" + dataKey).update({
		feedback_rating: rating,
		feedback_timestamp: new Date().toISOString(),
	});

	// 更新题目的点赞/点踩统计
	if (currentQuestion && currentQuestion.id) {
		const voteRef = database.ref(`question_votes/${currentQuestion.id}`);
		voteRef.transaction((votes) => {
			if (votes === null) {
				votes = { upvotes: 0, downvotes: 0 };
			}
			if (rating === "up") {
				votes.upvotes = (votes.upvotes || 0) + 1;
			} else {
				votes.downvotes = (votes.downvotes || 0) + 1;
			}
			return votes;
		});
	}

	// 显示感谢消息
	const feedbackDiv = document.getElementById("feedback-survey");
	if (rating === "up") {
		feedbackDiv.innerHTML = `<p style="color: #4a64f7; font-size: 16px;">${t('thanksUp')}</p>`;
	} else {
		feedbackDiv.innerHTML = `<p style="color: #ff6f00; font-size: 16px;">${t('thanksDown')}</p>`;
	}

	setTimeout(() => {
		feedbackDiv.style.display = "none";
	}, 1500);
}

// 保存游戏数据到Firebase（简化版）
function saveGameData(guess, difference, timeTaken, feedbackRating) {
	const dataKey = sessionId + "_" + Date.now();

	database.ref("singleplayer_feedback/" + dataKey).set({
		question_id: currentQuestion.id,
		question_text: currentQuestion.question_text,
		topic_pair: currentQuestion.topic_pair,
		creator: currentCreator,
		player_guess: guess,
		target_position: currentQuestion.target_position,
		difference: difference,
		time_taken_seconds: parseFloat(timeTaken),
		feedback_rating: feedbackRating,
		timestamp: new Date().toISOString(),
		session_id: sessionId,
	});
}

// 切换出题者
function changeCreator(creator) {
	currentCreator = creator;
	sessionId = generateSessionId();

	// 更新出题者按钮样式
	document.querySelectorAll(".creator-btn").forEach((btn) => {
		btn.classList.remove("active");
	});
	document.getElementById("creator-" + creator).classList.add("active");

	loadNextQuestion();
}

// 返回主菜单
function backToMenu() {
	document.getElementById("creator-selection").style.display = "block";
	document.getElementById("game-area").style.display = "none";
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

	// 显示绿色范围区域（但不显示具体数字）
	if (showTarget && currentQuestion) {
		// 计算范围：使用目标位置 ±15 作为合理范围
		const rangeStart = Math.max(0, currentQuestion.target_position - 15);
		const rangeEnd = Math.min(100, currentQuestion.target_position + 15);
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

		// 显示目标位置（金色星星）
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

	// 显示玩家猜测（红色圆点）
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
// 🎨 "我也来出题" 功能
// -------------------------

// 启动创作者模式 - 先询问名字
function startCreatorMode() {
	const name = prompt(t('enterName'));
	if (!name || name.trim() === "") {
		alert(t('nameRequired'));
		return;
	}

	creatorName = name.trim();
	isCreatorMode = true;
	createdQuestionsCount = 0;

	// 收集所有题目并随机选择3道
	const allQuestions = [];
	Object.keys(questionBank.creators).forEach(creator => {
		questionBank.creators[creator].questions.forEach(q => {
			allQuestions.push({...q, originalCreator: creator});
		});
	});

	// 随机打乱并只取3道题
	const shuffled = allQuestions.sort(() => Math.random() - 0.5);
	creatorModeQuestions = shuffled.slice(0, MAX_CREATOR_QUESTIONS);

	document.getElementById("creator-selection").style.display = "none";
	document.getElementById("game-area").style.display = "block";
	document.getElementById("current-creator").innerText = `${t('creatorLabel')}${creatorName}`;
	document.getElementById("game-subtitle").innerText = t('markPosition');
	document.getElementById("creator-controls").style.display = "none";

	loadCreatorQuestion();
}

// 加载创作者模式题目
async function loadCreatorQuestion() {
	if (creatorModeQuestions.length === 0 || createdQuestionsCount >= MAX_CREATOR_QUESTIONS) {
		showCreatorThankYou();
		return;
	}

	currentQuestion = creatorModeQuestions.shift();
	startTime = Date.now();

	// 更新UI - 使用多语言文本
	const topicPairText = getLocalizedText(currentQuestion.topic_pair);
	const topicParts = topicPairText.split(" ↔ ");
	document.getElementById("left-label").innerText = topicParts[0];
	document.getElementById("right-label").innerText = topicParts[1];

	// 显示题目和评价统计
	const questionText = getLocalizedText(currentQuestion.question_text);
	const voteStats = await displayQuestionVotes(currentQuestion.id);
	document.getElementById("question-text").innerHTML = questionText + voteStats;

	document.getElementById("guessSlider").value = 50;

	// 显示进度
	document.getElementById("guess-instruction").innerText =
		t('progress', {current: createdQuestionsCount + 1, total: MAX_CREATOR_QUESTIONS});

	document.getElementById("result-section").style.display = "none";
	document.getElementById("guess-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "none";

	drawArc(false, false);
}

// 提交创作者模式的范围
function submitCreatorGuess() {
	const targetPosition = parseInt(document.getElementById("guessSlider").value);
	const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);

	createdQuestionsCount++;

	// 保存到 Firebase - 作为新题目
	const questionId = `player_${creatorName}_${Date.now()}`;
	database.ref("player_questions/" + questionId).set({
		id: questionId,
		topic_pair: currentQuestion.topic_pair,
		target_position: targetPosition,
		question_text: currentQuestion.question_text,
		question_creator: creatorName,
		created_at: new Date().toISOString(),
		session_id: sessionId,
		original_question_id: currentQuestion.id,
		original_creator: currentQuestion.originalCreator,
		time_taken_seconds: parseFloat(timeTaken),
	});

	// 显示确认
	document.getElementById("result-text").innerHTML = `
		<h2 style="margin: 20px 0;">${t('recorded', {count: createdQuestionsCount})}</h2>
		<p style="font-size: 16px; color: #666;">${t('continuing')}</p>
	`;

	document.getElementById("guess-section").style.display = "none";
	document.getElementById("result-section").style.display = "block";

	// 1秒后自动进入下一题
	setTimeout(() => {
		loadCreatorQuestion();
	}, 1000);
}

// 显示感谢页面
function showCreatorThankYou() {
	document.getElementById("result-text").innerHTML = `
		<h1 style="font-size: 42px; margin: 20px 0;">🎉</h1>
		<h2 style="margin: 20px 0;">${t('thanksForCreating')}</h2>
		<p style="font-size: 18px; color: #4a64f7; margin: 15px 0;">
			${t('willAppear', {name: `<strong>${creatorName}</strong>`})}
		</p>
		<p style="font-size: 16px; color: #666; margin: 10px 0;">
			${t('completed', {count: MAX_CREATOR_QUESTIONS})}
		</p>
	`;

	document.getElementById("guess-section").style.display = "none";
	document.getElementById("result-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "none";

	// 改变"下一题"按钮为"返回主菜单"
	const nextBtn = document.querySelector("#result-section .button-9");
	if (nextBtn) {
		nextBtn.innerText = t('returnHome');
		nextBtn.onclick = () => {
			isCreatorMode = false;
			backToMenu();
		};
	}
}

// 包装 submitGuess 以支持创作者模式
window.submitGuess = function() {
	if (isCreatorMode) {
		submitCreatorGuess();
	} else {
		submitNormalGuess();
	}
}

// 包装 loadNextQuestion 以支持创作者模式和玩家题库
window.loadNextQuestion = function() {
	if (isCreatorMode) {
		loadCreatorQuestion();
	} else if (currentCreator === "Players") {
		loadPlayerQuestions();
	} else {
		loadNormalQuestion();
	}
}

// 原始的提交猜测函数（重命名）
function submitNormalGuess() {
	const guess = parseInt(document.getElementById("guessSlider").value);
	const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);

	// 计算准确度
	const difference = Math.abs(guess - currentQuestion.target_position);

	// 判断结果 - 简化版，不显示具体数值
	let result = "";
	let resultEmoji = "";

	if (difference <= 5) {
		result = t('perfect');
		resultEmoji = "💯";

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
	} else if (difference <= 15) {
		result = t('veryClose');
		resultEmoji = "✅";
	} else if (difference <= 25) {
		result = t('notBad');
		resultEmoji = "😊";
	} else {
		result = t('tooFar');
		resultEmoji = "😢";
	}

	// 保存数据到Firebase（简化版）
	saveGameData(guess, difference, timeTaken, null);

	// 显示结果
	displayResult(resultEmoji, result, guess);
}

// 获取并显示题目评价统计
async function displayQuestionVotes(questionId) {
	try {
		const snapshot = await database.ref(`question_votes/${questionId}`).once("value");
		const votes = snapshot.val();

		if (votes && (votes.upvotes > 0 || votes.downvotes > 0)) {
			const total = votes.upvotes + votes.downvotes;
			const upPercent = Math.round((votes.upvotes / total) * 100);

			return `<div style="font-size: 14px; color: #666; margin: 10px 0;">
				<span style="color: #4a64f7;">👍 ${votes.upvotes}</span>
				<span style="margin: 0 5px;">|</span>
				<span style="color: #ff6f00;">👎 ${votes.downvotes}</span>
				<span style="margin-left: 10px;">(${upPercent}% ${t('positive')})</span>
			</div>`;
		}
		return "";
	} catch (error) {
		console.error("加载评价失败:", error);
		return "";
	}
}

// 原始的加载下一题函数（重命名）
async function loadNormalQuestion() {
	if (!questionBank) return;

	const questions = questionBank.creators[currentCreator].questions;
	if (!questions || questions.length === 0) {
		alert("该出题者没有题目！");
		return;
	}

	// 随机选择一道题
	currentQuestion = questions[Math.floor(Math.random() * questions.length)];
	startTime = Date.now();

	// 更新UI - 使用多语言文本
	const topicPairText = getLocalizedText(currentQuestion.topic_pair);
	const topicParts = topicPairText.split(" ↔ ");
	document.getElementById("left-label").innerText = topicParts[0];
	document.getElementById("right-label").innerText = topicParts[1];

	// 显示题目和评价统计
	const questionText = getLocalizedText(currentQuestion.question_text);
	const voteStats = await displayQuestionVotes(currentQuestion.id);
	document.getElementById("question-text").innerHTML = questionText + voteStats;

	document.getElementById("guessSlider").value = 50;

	// 显示当前出题者
	document.getElementById("current-creator").innerText =
		`${t('creatorLabel')}${currentCreator}`;

	// 隐藏结果区域
	document.getElementById("result-section").style.display = "none";
	document.getElementById("guess-section").style.display = "block";
	document.getElementById("feedback-survey").style.display = "none";

	// 重绘画布
	drawArc(false, false);
}

// -------------------------
// 🚀 页面加载时初始化
// -------------------------
window.addEventListener("DOMContentLoaded", () => {
	loadQuestionBank();
	drawArc(false, false);
});
