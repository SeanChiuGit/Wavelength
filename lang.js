// 双语配置文件
const translations = {
	zh: {
		// 主标题
		mainTitle: "一个人也能玩",
		modeSwitch: "切换到多人模式",

		// 出题者选择
		selectCreator: "选择出题者：",
		playerBank: "玩家题库",
		iWillCreate: "✨ 我也来出题",

		// 创作者描述
		creatorDesc: {
			Sean: "充满创意的题目设计师",
			Charles: "思考型题目专家",
			Brus: "哲学与深度思考者"
		},

		// 游戏界面
		guessWhat: "猜猜创作者怎么想",
		creatorLabel: "出题者：",
		dragSlider: "拖动滑条或点击弧线进行猜测",
		submitAnswer: "提交答案",
		nextQuestion: "下一题",
		backToMenu: "⬅️ 返回主菜单",

		// 结果反馈
		perfect: "完美命中！",
		veryClose: "非常接近！",
		notBad: "还不错",
		tooFar: "有点远了",

		// 反馈调查
		howWasIt: "这道题怎么样？",
		thanksUp: "👍 感谢！",
		thanksDown: "👎 已记录",

		// 我也来出题
		enterName: "请输入你的名字（将显示为出题者）：",
		nameRequired: "需要输入名字才能出题哦！",
		markPosition: "🎨 标记你认为答案应该在的位置",
		progress: "🎨 第 {current}/{total} 题：拖动滑条标记答案位置",
		recorded: "✅ 第 {count} 题已记录！",
		continuing: "继续下一题...",
		thanksForCreating: "感谢出题！",
		willAppear: "{name}，你出的题目很快就会出现在玩家题库中！",
		completed: "已完成 {count} 道题目的标记",
		returnHome: "🏠 返回主菜单",

		// 玩家题库
		guessPlayers: "猜猜其他玩家怎么想",
		noPlayerQuestions: "玩家题库暂时没有题目，快去「我也来出题」吧！",
		loadFailed: "加载失败，请稍后重试",

		// 规则说明
		rulesTitle: "游戏规则",
		rule1: "1. 选择出题者，猜猜他们会怎么想",
		rule2: "2. 看题目后，在频谱上猜测答案位置",
		rule3: "3. 或者选择「我也来出题」，分享你的想法！🎨"
	},

	en: {
		// Main title
		mainTitle: "Play Solo",
		modeSwitch: "Switch to Multiplayer",

		// Creator selection
		selectCreator: "Select Creator:",
		playerBank: "Player Bank",
		iWillCreate: "✨ I'll Create",

		// Creator descriptions
		creatorDesc: {
			Sean: "Creative Question Designer",
			Charles: "Thoughtful Question Expert",
			Brus: "Philosophy & Deep Thinker"
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

		// I'll create
		enterName: "Enter your name (will be shown as creator):",
		nameRequired: "Name is required to create questions!",
		markPosition: "🎨 Mark where you think the answer should be",
		progress: "🎨 Question {current}/{total}: Drag slider to mark position",
		recorded: "✅ Question {count} recorded!",
		continuing: "Continuing...",
		thanksForCreating: "Thanks for Creating!",
		willAppear: "{name}, your questions will appear in the player bank soon!",
		completed: "Completed {count} questions",
		returnHome: "🏠 Back to Menu",

		// Player bank
		guessPlayers: "Guess What Other Players Think",
		noPlayerQuestions: "No questions in player bank yet. Try 'I'll Create'!",
		loadFailed: "Failed to load, please try again later",

		// Rules
		rulesTitle: "Game Rules",
		rule1: "1. Select a creator and guess what they think",
		rule2: "2. After viewing the question, guess the answer position on the spectrum",
		rule3: "3. Or select 'I'll Create' to share your thoughts! 🎨"
	}
};

// 当前语言
let currentLang = 'zh';

// 获取翻译文本
function t(key, replacements = {}) {
	const keys = key.split('.');
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
	localStorage.setItem('wavelength_lang', lang);
	updateAllText();
}

// 更新所有文本
function updateAllText() {
	// 更新所有带 data-i18n 属性的元素
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		el.textContent = t(key);
	});

	// 更新语言切换按钮
	const langButton = document.getElementById('lang-switch');
	if (langButton) {
		langButton.textContent = currentLang === 'zh' ? 'EN' : '中文';
	}
}

// 页面加载时初始化语言
window.addEventListener('DOMContentLoaded', () => {
	const savedLang = localStorage.getItem('wavelength_lang') || 'zh';
	switchLanguage(savedLang);

	// 添加语言切换按钮事件
	const langButton = document.getElementById('lang-switch');
	if (langButton) {
		langButton.addEventListener('click', () => {
			switchLanguage(currentLang === 'zh' ? 'en' : 'zh');
		});
	}
});
