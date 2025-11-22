// 双语配置文件
const translations = {
	zh: {
		// 主标题
		mainTitle: "一个人也能玩",
		modeSwitch: "🧑‍🧑‍🧒‍🧒 多人模式",
		questionEditor: "📝 题库编辑",

		// 出题者选择
		selectCreator: "选择出题者：",
		playerBank: "玩家题库",

		// 创作者描述
		creatorDesc: {
			Sean: "充满创意的题目设计师",
			Charles: "思考型题目专家",
			Brus: "哲学与深度思考者",
		},

		// 游戏界面
		guessWhat: "猜猜创作者怎么想",
		creatorLabel: "出题者：",
		dragSlider: "拖动滑条进行猜测",
		submitAnswer: "提交",
		nextQuestion: "下一题",
		backToMenu: "返回主页",

		// 结果反馈
		perfect: "完美命中！",
		veryClose: "非常接近！",
		notBad: "还不错～",
		tooFar: "有点远了～",

		// 反馈调查
		howWasIt: "这道题怎么样？",
		thanksUp: "👍  感谢！",
		thanksDown: "👎  已记录",
		positive: "好评",

		// 玩家题库
		guessPlayers: "猜猜其他玩家怎么想",
		noPlayerQuestions: "玩家题库暂时没有题目",
		loadFailed: "加载失败，请稍后重试",

		// 规则说明
		rulesTitle: "游戏规则",
		rule1: "1. 选择出题者，猜猜他们会怎么想",
		rule2: "2. 看题目后，在频谱上猜测答案位置",
		rule3: "3. 尝试理解出题者的思路，挑战默契极限！🔥",

		// 多人模式
		singlePlayerMode: "👤 单人模式",
		multiplayerRulesTitle: "游戏规则",
		multiplayerRule1: "1. 房主点击「创建房间」，分享房间号。",
		multiplayerRule2: "2. 出题方输入提示词，猜测方拖动滑条猜位置。",
		multiplayerRule3: "3. 尝试理解彼此的思路，挑战默契极限！🔥",
		createRoom: "🛋️ 创建房间",
		joinRoom: "🔗 加入",
		enterRoomId: "输入房间号",
		notConnected: "❌ 未连接",
		connected: "✅ 已连接",
		timeSettings: "⚙️ 时间设置",
		hintTime: "出题时间：",
		guessTime: "猜测时间：",
		seconds: "秒",
		loading: "加载中...",
		roomCreatedWaiting: "房间已创建，等待玩家加入",

		// 多人模式动态文本
		waitingForPlayers: "等待玩家加入...",
		roomCreatedWithId: "✅ 房间已创建：{roomId}",
		playerJoinedStart: "玩家已加入，点击开始游戏！",
		enterHint: "请输入提示词...",
		waitingForGuess: "等待对方猜测...  提示词为: {hint}",
		waitingForHint: "🕐 等待对方输入提示词...",
		waitingNewRound: "等待开始新一轮...",
		timeRemaining: "⏳ 剩余时间：{seconds} 秒",
		roomJoined: "✅ 已加入房间",
		roomNotExist: "❌ 房间不存在，请检查房间号是否正确",
		roomFull: "❌ 房间已满，无法加入",
		connectionFailed: "连接失败：{error}",
		enterRoomIdAlert: "请输入房间号",
		enterHintAlert: "请输入提示词！",
		timeoutHint: "⏰ 时间到！你没能及时出题！系统随机生成了提示词：{hint}",
		timeoutGuess: "⏰ 时间到！你没能及时猜测！系统随机生成了猜测值：{value}",
		perfectHit: "💯 完美命中！太神啦！",
		hitRange: "✅ 猜中了范围！不错！",
		missedRange: "😢 没猜中！正确范围是 {start} ~ {end}",
		waitingHint: "（等待提示）",
	},

	en: {
		// Main title
		mainTitle: "Play Solo",
		modeSwitch: "Switch to Multiplayer",
		questionEditor: "📝 Wavelength Editor",

		// Creator selection
		selectCreator: "Select Creator:",
		playerBank: "Random",

		// Creator descriptions
		creatorDesc: {
			Sean: "Creative Question Designer",
			Charles: "Thoughtful Question Expert",
			Brus: "Philosophy & Deep Thinker",
		},

		// Game interface
		guessWhat: "Guess What the Creator Thinks",
		creatorLabel: "Creator: ",
		dragSlider: "Drag the slider to guess",
		submitAnswer: "Submit Answer",
		nextQuestion: "Next",
		backToMenu: "⬅️ Return",

		// Result feedback
		perfect: "Perfect Hit!",
		veryClose: "Very Close!",
		notBad: "Not Bad",
		tooFar: "A Bit Far",

		// Feedback survey
		howWasIt: "Do you like this question?",
		thanksUp: "👍 Thanks!",
		thanksDown: "👎 Recorded",
		positive: "positive",

		// Player bank
		guessPlayers: "Guess What Other Players Think",
		noPlayerQuestions: "No questions in player bank yet.",
		loadFailed: "Failed to load, please try again later",

		// Rules
		rulesTitle: "Game Rules",
		rule1: "1. Select a creator and guess what they think",
		rule2:
			"2. After viewing the question, guess the answer position on the spectrum",
		rule3:
			"3. Try to understand the creator's thoughts, challenge yourself! 🔥",

		// Multiplayer mode
		singlePlayerMode: "🎮 Single Player",
		multiplayerRulesTitle: "Game Rules",
		multiplayerRule1: "1. Host creates a room and shares the room code.",
		multiplayerRule2:
			"2. Questioner enters hint, guesser drags slider to guess position.",
		multiplayerRule3:
			"3. Try to understand each other's thoughts, challenge your connection! 🔥",
		createRoom: "🛋️ New Room",
		joinRoom: "🔗 Join",
		enterRoomId: "Enter room code",
		notConnected: "❌ Not connected",
		connected: "✅ Connected",
		timeSettings: "⚙️ Time Settings",
		hintTime: "Hint time:",
		guessTime: "Guess time:",
		seconds: "s",
		loading: "Loading...",
		roomCreatedWaiting: "Room created, waiting for players to join",

		// Multiplayer dynamic text
		waitingForPlayers: "Waiting for players...",
		roomCreatedWithId: "✅ Room created: {roomId}",
		playerJoinedStart: "Player joined, click to start!",
		enterHint: "Enter your hint...",
		waitingForGuess: "Waiting for guess... Hint: {hint}",
		waitingForHint: "🕐 Waiting for hint...",
		waitingNewRound: "Waiting for new round...",
		timeRemaining: "⏳ Time left: {seconds}s",
		roomJoined: "✅ Joined room",
		roomNotExist: "❌ Room does not exist",
		roomFull: "❌ Room is full",
		connectionFailed: "Connection failed: {error}",
		enterRoomIdAlert: "Please enter room code",
		enterHintAlert: "Please enter a hint!",
		timeoutHint: "⏰ Time's up! Random hint generated: {hint}",
		timeoutGuess: "⏰ Time's up! Random guess generated: {value}",
		perfectHit: "💯 Perfect hit! Amazing!",
		hitRange: "✅ Within range! Nice!",
		missedRange: "😢 Missed! Correct range: {start} ~ {end}",
		waitingHint: "(Waiting for hint)",
	},
};

// 当前语言
let currentLang = "zh";

// 语言切换回调函数列表
const langChangeCallbacks = [];

// 注册语言切换回调
function onLangChange(callback) {
	if (typeof callback === "function") {
		langChangeCallbacks.push(callback);
	}
}

// 获取翻译文本
function t(key, replacements = {}) {
	const keys = key.split(".");
	let value = translations[currentLang];

	for (const k of keys) {
		value = value[k];
		if (value === undefined) return key;
	}

	// 替换占位符
	let result = value;
	for (const [placeholder, replacement] of Object.entries(replacements)) {
		result = result.replace(`{${placeholder}}`, replacement);
	}

	return result;
}

// 设置动态文本（支持语言切换时自动更新）
function setDynamicText(elementId, key, replacements = {}) {
	const el = document.getElementById(elementId);
	if (el) {
		el.textContent = t(key, replacements);
		el.setAttribute("data-i18n-dynamic", key);
		if (Object.keys(replacements).length > 0) {
			el.setAttribute("data-i18n-params", JSON.stringify(replacements));
		} else {
			el.removeAttribute("data-i18n-params");
		}
	}
}

// 清除动态文本（同时移除 i18n 属性）
function clearDynamicText(elementId) {
	const el = document.getElementById(elementId);
	if (el) {
		el.textContent = "";
		el.removeAttribute("data-i18n-dynamic");
		el.removeAttribute("data-i18n-params");
	}
}

// 切换语言
function switchLanguage(lang) {
	currentLang = lang;
	localStorage.setItem("wavelength_lang", lang);
	updateAllText();
}

// 更新所有文本
function updateAllText() {
	// 更新所有带 data-i18n 属性的元素
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		el.textContent = t(key);
	});

	// 更新所有带 data-i18n-placeholder 属性的元素
	document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
		const key = el.getAttribute("data-i18n-placeholder");
		el.placeholder = t(key);
	});

	// 更新所有动态设置的文本
	document.querySelectorAll("[data-i18n-dynamic]").forEach((el) => {
		const key = el.getAttribute("data-i18n-dynamic");
		const paramsStr = el.getAttribute("data-i18n-params");
		const params = paramsStr ? JSON.parse(paramsStr) : {};
		el.textContent = t(key, params);
	});

	// 更新语言切换按钮
	const langButton = document.getElementById("lang-switch");
	if (langButton) {
		langButton.textContent = currentLang === "zh" ? "🇬🇧 EN" : "🇨🇳 中文";
	}

	// 执行所有注册的回调函数
	langChangeCallbacks.forEach((callback) => {
		try {
			callback(currentLang);
		} catch (e) {
			console.error("Language change callback error:", e);
		}
	});
}

// 页面加载时初始化语言
window.addEventListener("DOMContentLoaded", () => {
	const savedLang = localStorage.getItem("wavelength_lang") || "zh";
	switchLanguage(savedLang);

	// 添加语言切换按钮事件
	const langButton = document.getElementById("lang-switch");
	if (langButton) {
		langButton.addEventListener("click", () => {
			switchLanguage(currentLang === "zh" ? "en" : "zh");
		});
	}
});
