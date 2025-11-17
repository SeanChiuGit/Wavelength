# 🎮 Wavelength 单人模式 - 开发者文档

欢迎使用 Wavelength 单人模式！本文档将帮助您了解单人模式的功能、文件结构和使用方法。

---

## 📦 文件清单

单人模式包含以下新增文件：

```
Wavelength/
├── singleplayer.html           # 单人模式游戏界面
├── singleplayer.js             # 单人模式游戏逻辑
├── question_bank.json          # 题库文件（30道题：10简单/10中等/10困难）
├── creator_template.md         # 内容创作者指南
├── SINGLEPLAYER_README.md      # 本文档
└── index.html                  # 多人模式（已添加切换按钮）
```

---

## 🚀 快速开始

### 1. 启动游戏

1. 在浏览器中打开 `singleplayer.html`
2. 选择难度级别（简单/中等/困难）
3. 开始答题！

### 2. 从多人模式切换

- 在 `index.html`（多人模式）右上角，点击 **"🎮 单人模式"** 按钮
- 在 `singleplayer.html`（单人模式）右上角，点击 **"🔄 切换到多人模式"** 按钮

---

## 🎯 游戏机制

### 核心玩法

1. **选择难度**：简单/中等/困难
2. **查看题目**：系统随机从题库中抽取一道题
3. **查看频谱对**：例如 "寒冷 ↔ 炎热"
4. **进行猜测**：拖动滑条或点击弧线，猜测答案在频谱上的位置（0-100）
5. **查看结果**：
   - 💯 **完美命中**：猜测在最佳范围内（100分）
   - ✅ **不错**：在合理范围内（60分）
   - 😊 **接近**：差距 ≤20（30分）
   - 😢 **未命中**：差距较大（10分）
6. **评价题目**：点击 👍 或 👎 提供反馈
7. **下一题**：继续挑战，累积分数！

### 计分系统

- **总分**：累计所有题目的得分
- **已答题数**：统计答题数量
- **平均分**：总分 ÷ 已答题数

---

## 📊 题库结构

### question_bank.json 格式

```json
{
  "version": "1.0.0",
  "total_questions": 30,
  "questions": {
    "easy": [ /* 10道简单题 */ ],
    "medium": [ /* 10道中等题 */ ],
    "hard": [ /* 10道困难题 */ ]
  }
}
```

### 单个题目格式

```json
{
  "id": "easy_001",
  "topic_pair": "冰冻寒冷 ↔ 炙热灼热",
  "target_position": 15,
  "difficulty": "easy",
  "range_hint": [5, 30],
  "question_text": "南极洲",
  "question_creator": "陈艾玛",
  "explanation_for_creator": "具有极端气候的地理位置很直观。南极洲是公认的极度寒冷之地。"
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符 |
| `topic_pair` | string | 频谱两端，用 " ↔ " 分隔 |
| `target_position` | number | 正确答案位置（0-100） |
| `difficulty` | string | 难度级别（easy/medium/hard） |
| `range_hint` | array | 合理猜测范围 [最小值, 最大值] |
| `question_text` | string | 显示给玩家的题目 |
| `question_creator` | string | 创作者姓名 |
| `explanation_for_creator` | string | 设计思路说明 |

---

## 💾 数据存储

### Firebase 数据库结构

所有游戏数据自动保存到 Firebase Realtime Database：

```
singleplayer_feedback/
└── {sessionId}_{questionNumber}
    ├── question_id: "easy_001"
    ├── question_text: "南极洲"
    ├── topic_pair: "冰冻寒冷 ↔ 炙热灼热"
    ├── difficulty: "easy"
    ├── player_guess: 42
    ├── target_position: 15
    ├── accuracy_score: 73
    ├── time_taken_seconds: 8.4
    ├── score_earned: 60
    ├── feedback_rating: "up"
    ├── timestamp: "2025-11-17T14:32:11Z"
    └── session_id: "sp_1234567890_abc123"
```

### 访问数据

1. 登录 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目：`wavelength-58ccd`
3. 进入 **Realtime Database**
4. 查看 `singleplayer_feedback` 节点

---

## 🎨 自定义与扩展

### 添加新题目

1. 打开 `question_bank.json`
2. 在对应难度数组中添加新题目
3. 更新 `total_questions` 数字
4. 保存文件

**示例：**

```json
{
  "id": "medium_011",
  "topic_pair": "古老 ↔ 现代",
  "target_position": 25,
  "difficulty": "medium",
  "range_hint": [15, 40],
  "question_text": "印刷术",
  "question_creator": "你的名字",
  "explanation_for_creator": "历史发明，年代有模糊性"
}
```

### 修改计分规则

在 `singleplayer.js` 的 `submitGuess()` 函数中修改：

```javascript
// 当前规则（第 297-310 行）
if (guess >= perfectStart && guess <= perfectEnd) {
  result = "💯 完美命中！太神啦！";
  scoreEarned = 100;  // 修改这里改变分数
}
```

### 调整难度算法

修改 `range_hint` 的计算方式：

```javascript
// 在 singleplayer.js 的 submitGuess() 函数中
const zoneSize = Math.floor(
  (currentQuestion.range_hint[1] - currentQuestion.range_hint[0]) / 3
);
```

---

## 🔧 技术细节

### 核心功能函数

| 函数名 | 功能 |
|--------|------|
| `loadQuestionBank()` | 从 JSON 文件加载题库 |
| `startGame(difficulty)` | 开始游戏，设置难度 |
| `loadNextQuestion()` | 随机加载下一题 |
| `submitGuess()` | 提交玩家猜测，计算得分 |
| `displayResult()` | 显示结果和正确答案 |
| `submitFeedback(rating)` | 提交题目反馈（👍/👎） |
| `saveGameData()` | 保存数据到 Firebase |
| `drawArc()` | 绘制频谱弧线和指示器 |

### 音效

- **完美命中音效**：`assets/partypop.mp3`（与多人模式共享）
- **礼炮特效**：使用 `canvas-confetti` 库

### 响应式设计

- 画布尺寸：400×250 像素
- 支持鼠标点击和滑条拖动两种输入方式
- 自适应移动端（继承 `style.css`）

---

## 📈 数据分析建议

### 查看题目质量

在 Firebase Console 中筛选数据：

1. **高评价题目**：`feedback_rating == "up"`
2. **低评价题目**：`feedback_rating == "down"`
3. **难度合理性**：查看 `accuracy_score` 分布
   - 简单题：平均 accuracy_score > 70
   - 中等题：平均 accuracy_score 50-70
   - 困难题：平均 accuracy_score < 50

### 导出数据进行分析

使用 Firebase 提供的 REST API 或 SDK 导出数据：

```javascript
// 示例：获取所有反馈数据
database.ref('singleplayer_feedback').once('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  // 进行数据分析...
});
```

---

## 🛠️ 故障排查

### 题库无法加载

**问题**：页面显示 "题库加载失败，请刷新页面重试！"

**解决方案**：
1. 确认 `question_bank.json` 存在于正确目录
2. 检查 JSON 格式是否正确（使用 [JSONLint](https://jsonlint.com/)）
3. 检查浏览器控制台的网络请求

### 数据未保存到 Firebase

**问题**：游戏数据没有出现在 Firebase 中

**解决方案**：
1. 检查 Firebase 配置是否正确（`singleplayer.js` 第 4-12 行）
2. 检查 Firebase 数据库规则（需允许写入）
3. 查看浏览器控制台的错误信息

### 画布不显示

**问题**：频谱弧线不显示

**解决方案**：
1. 确认 `<canvas id="arcCanvas">` 存在
2. 检查 CSS 是否隐藏了画布
3. 在控制台运行 `drawArc(true, true, 50)` 测试

---

## 📝 待办事项（可选扩展）

- [ ] 添加排行榜系统
- [ ] 实现题目收藏功能
- [ ] 添加成就系统（例如：连续答对 5 题）
- [ ] 支持自定义题库上传
- [ ] 添加题目难度动态调整（根据玩家表现）
- [ ] 多语言支持（英文版题库）
- [ ] 题目标签系统（科学、文化、娱乐等）
- [ ] 统计仪表板（答题历史、强弱项分析）

---

## 🎓 内容创作者指南

如果您想创作新题目，请参考：

📖 **[creator_template.md](creator_template.md)** - 完整的题目创作指南

内容包括：
- 题目结构模板
- 常见错误与最佳实践
- 三种难度的设计技巧
- 频谱对设计指南
- 完整示例

---

## 🤝 贡献

欢迎贡献新题目或功能改进！

### 提交新题目

1. 使用 `creator_template.md` 设计题目
2. 验证 JSON 格式
3. 测试题目质量（让朋友试答）
4. 提交到题库

### 报告问题

如发现 bug 或有功能建议：
1. 记录问题详情（截图、错误信息）
2. 说明复现步骤
3. 提供浏览器和设备信息

---

## 📞 联系方式

- **项目仓库**：（在此添加您的 GitHub 仓库链接）
- **问题反馈**：（在此添加问题跟踪链接）
- **邮件联系**：（在此添加联系邮箱）

---

## 📄 许可证

本项目遵循与原 Wavelength 多人模式相同的许可证。

---

**祝您游戏愉快！** 🎉

如有任何问题，请参考本文档或查看源代码注释。
