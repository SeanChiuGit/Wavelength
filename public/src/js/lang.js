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
	},

	en: {
		// Main title
		mainTitle: "Play Solo",
		modeSwitch: "Switch to Multiplayer",
		questionEditor: "📝 Wavelength Editor",

		// Creator selection
		selectCreator: "Select Creator:",
		playerBank: "Player Bank",

		// Creator descriptions
		creatorDesc: {
			Sean: "Creative Question Designer",
			Charles: "Thoughtful Question Expert",
			Brus: "Philosophy & Deep Thinker",
		},

		// Game interface
		guessWhat: "Guess What the Creator Thinks",
		creatorLabel: "Creator: ",
		dragSlider: "Drag the slider or click the arc to guess",
		submitAnswer: "Submit Answer",
		nextQuestion: "Next",
		backToMenu: "⬅️ Back to Menu",

		// Result feedback
		perfect: "Perfect Hit!",
		veryClose: "Very Close!",
		notBad: "Not Bad",
		tooFar: "A Bit Far",

		// Feedback survey
		howWasIt: "How was this question?",
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
		createRoom: "🛋️ Create Room",
		joinRoom: "🔗 Join",
		enterRoomId: "Enter room code",
		notConnected: "❌ Not connected",
		connected: "✅ Connected",
		timeSettings: "⚙️ Time Settings",
		hintTime: "Hint time:",
		guessTime: "Guess time:",
		seconds: "s",
		loading: "Loading...",
	},
};

// 当前语言
let currentLang = "zh";

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

	// 更新语言切换按钮
	const langButton = document.getElementById("lang-switch");
	if (langButton) {
		langButton.textContent = currentLang === "zh" ? "🇬🇧 EN" : "🇨🇳 中文";
	}
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
