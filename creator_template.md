# 📋 Wavelength 单人模式题目创作模板

本模板用于帮助内容创作者设计高质量的 Wavelength 单人模式题目。

---

## 🎯 题目结构模板

```json
{
  "id": "difficulty_###",
  "topic_pair": "左端极端 ↔ 右端极端",
  "target_position": 0-100,
  "difficulty": "easy|medium|hard",
  "range_hint": [下界, 上界],
  "question_text": "你的具体题目/主题",
  "question_creator": "你的名字",
  "explanation_for_creator": "简要说明如何设计类似题目"
}
```

---

## ✅ 必填字段检查清单

创建题目时，请确保以下字段都已填写：

- [ ] **id**: 唯一标识符（格式：difficulty_编号，如 easy_001）
- [ ] **topic_pair**: 两个清晰的对立面，用 " ↔ " 分隔（必须使用这个符号）
- [ ] **target_position**: 0-100 之间的整数，表示答案在频谱上的位置
- [ ] **difficulty**: 必须是 "easy"、"medium" 或 "hard" 之一
- [ ] **range_hint**: 包含两个数字的数组 [最小值, 最大值]，建议玩家猜测的范围
- [ ] **question_text**: 玩家看到的实际题目/主题
- [ ] **question_creator**: 你的名字（可以是笔名）
- [ ] **explanation_for_creator**: 1-2 句话解释你的设计思路

---

## 🚫 常见错误与最佳实践

### 1️⃣ 模糊的频谱对

❌ **错误示例**：
```json
"topic_pair": "好 ↔ 坏"
```
问题：太主观，没有明确标准

✅ **正确示例**：
```json
"topic_pair": "广受欢迎的食物 ↔ 普遍厌恶的食物"
```

---

### 2️⃣ 位置设置不合理

❌ **错误示例**：
```json
{
  "topic_pair": "寒冷 ↔ 炎热",
  "target_position": 45,
  "question_text": "太阳表面"
}
```
问题：太阳表面应该接近 100（极度炎热），而不是 45

✅ **正确示例**：
```json
{
  "topic_pair": "寒冷 ↔ 炎热",
  "target_position": 98,
  "question_text": "太阳表面"
}
```

---

### 3️⃣ 难度标记不当

❌ **错误示例**：
```json
{
  "difficulty": "hard",
  "question_text": "水是湿的吗？"
}
```
问题：这个问题要么是显而易见的（应标记为 easy），要么是哲学争论（确实是 hard，但需要更清晰的频谱对）

✅ **正确示例（简单）**：
```json
{
  "topic_pair": "干燥 ↔ 湿润",
  "difficulty": "easy",
  "target_position": 95,
  "question_text": "水"
}
```

✅ **正确示例（困难）**：
```json
{
  "topic_pair": "客观真实 ↔ 客观虚假",
  "difficulty": "hard",
  "target_position": 52,
  "question_text": "水具有'湿'这一内在属性"
}
```

---

### 4️⃣ 范围提示太宽

❌ **错误示例**：
```json
"range_hint": [0, 100]
```
问题：覆盖整个范围，失去了"提示"的意义

✅ **正确示例**：
```json
"range_hint": [60, 85]
```

---

### 5️⃣ 文化特定性问题未标注

❌ **错误示例**：
```json
{
  "question_text": "板球有多受欢迎？",
  "topic_pair": "小众运动 ↔ 全民运动"
}
```
问题：板球在印度很流行，但在中国不太流行，缺少上下文

✅ **正确示例**：
```json
{
  "question_text": "板球在印度的流行程度",
  "topic_pair": "小众运动 ↔ 全民运动"
}
```

---

## 💡 高质量题目设计技巧

### 📌 **简单题目（Easy）**

**设计原则：**
- 使用普遍知晓的概念（动物、天气、著名地标）
- 设置极端位置（0-20 或 80-100）
- 避免需要文化/地域知识
- 测试标准："12岁的孩子能理解吗？"

**优秀示例：**
```json
{
  "id": "easy_001",
  "topic_pair": "安静 ↔ 吵闹",
  "target_position": 5,
  "difficulty": "easy",
  "range_hint": [0, 15],
  "question_text": "图书馆",
  "question_creator": "张三",
  "explanation_for_creator": "日常场所的音量对比，人人都有直观感受"
}
```

---

### 📌 **中等题目（Medium）**

**设计原则：**
- 引入主观性或文化差异
- 位置在 30-70 范围（更模糊）
- 需要生活经验或专业知识
- 测试标准："两个人的答案会相差 15-20 分吗？"

**优秀示例：**
```json
{
  "id": "medium_001",
  "topic_pair": "容易学 ↔ 难以精通",
  "target_position": 65,
  "difficulty": "medium",
  "range_hint": [50, 80],
  "question_text": "下围棋",
  "question_creator": "李四",
  "explanation_for_creator": "学习曲线陡峭的技能。基础规则简单，但要成为高手需要多年训练"
}
```

---

### 📌 **困难题目（Hard）**

**设计原则：**
- 关注哲学辩论、新兴技术或未解之谜
- 拥抱真正的模糊性（40-60 范围常见）
- 挑战玩家对客观性的假设
- 测试标准："专家也会对此有不同意见吗？"

**优秀示例：**
```json
{
  "id": "hard_001",
  "topic_pair": "艺术 ↔ 非艺术",
  "target_position": 55,
  "difficulty": "hard",
  "range_hint": [35, 75],
  "question_text": "AI生成的绘画作品",
  "question_creator": "王五",
  "explanation_for_creator": "当代艺术定义的挑战。AI艺术在艺术界存在激烈争论"
}
```

---

## 🎯 频谱对设计指南

**优秀的频谱对特征：**
- 两端明确且易于理解
- 允许中间地带的细微差别
- 避免二元对立（是/否）
- 尽可能跨文化适用

### 示例对比表

| 质量 | 较弱的频谱对 | 优秀的频谱对 |
|------|-------------|-------------|
| **清晰度** | "坏 ↔ 好" | "质量糟糕 ↔ 质量优秀" |
| **粒度** | "是 ↔ 否" | "绝对错误 ↔ 绝对正确" |
| **客观性** | "错 ↔ 对" | "科学已证伪 ↔ 科学已证实" |
| **普遍性** | "美国化 ↔ 非美国化" | "个人主义文化 ↔ 集体主义文化" |

---

## 📊 目标位置校准参考

使用这个粗略指南：

- **0-10**: 极端左侧（例：冷热谱上的"南极洲"）
- **11-30**: 强左侧（例：音量谱上的"耳语"）
- **31-45**: 中等偏左（例：智力谱上的"猫"）
- **46-54**: 真正的中间（例：运气技能谱上的"扑克"）
- **55-69**: 中等偏右（例：有用无用谱上的"冰箱"）
- **70-89**: 强右侧（例：便宜昂贵谱上的"豪宅"）
- **90-100**: 极端右侧（例：明暗谱上的"太阳"）

---

## 🧪 自我审查问题

提交题目前，问自己：

1. ✅ 我能为 target_position 提供合理的解释吗？
2. ✅ 80% 的玩家会把答案放在我的目标位置 ±15 范围内吗？
3. ✅ 难度等级与预期的分歧范围匹配吗？
4. ✅ question_text 足够具体，不会引起混淆吗？
5. ✅ 频谱的两端都同样清晰吗？

---

## 📝 完整示例（三个难度）

### 简单示例
```json
{
  "id": "easy_999",
  "topic_pair": "慢速 ↔ 快速",
  "target_position": 6,
  "difficulty": "easy",
  "range_hint": [0, 20],
  "question_text": "树懒",
  "question_creator": "动物学家小明",
  "explanation_for_creator": "使用众所周知速度特征的动物。树懒是'慢'的文化符号"
}
```

### 中等示例
```json
{
  "id": "medium_999",
  "topic_pair": "被低估 ↔ 被高估",
  "target_position": 58,
  "difficulty": "medium",
  "range_hint": [40, 75],
  "question_text": "睡眠的重要性",
  "question_creator": "健康专家小红",
  "explanation_for_creator": "科学界认为重要，但普通人常忽视。存在认知差距创造模糊性"
}
```

### 困难示例
```json
{
  "id": "hard_999",
  "topic_pair": "帮助人类 ↔ 伤害人类",
  "target_position": 51,
  "difficulty": "hard",
  "range_hint": [35, 70],
  "question_text": "基因编辑技术（CRISPR）",
  "question_creator": "生物伦理学家小李",
  "explanation_for_creator": "前沿技术具有巨大潜力和巨大风险。专家意见分歧严重"
}
```

---

## 🎓 进阶技巧

### 1. 使用"反直觉"位置
有时候看似明显的答案实际上更细腻：

```json
{
  "topic_pair": "简单 ↔ 复杂",
  "target_position": 72,
  "question_text": "教小孩骑自行车",
  "explanation_for_creator": "表面简单但涉及平衡、心理鼓励、安全等多层面"
}
```

### 2. 利用时代变迁
```json
{
  "topic_pair": "必需品 ↔ 奢侈品",
  "target_position": 58,
  "question_text": "智能手机（在2024年）",
  "explanation_for_creator": "20年前是奢侈品，现在接近必需，但仍有争议"
}
```

### 3. 文化比较
```json
{
  "topic_pair": "禁忌话题 ↔ 日常话题",
  "target_position": 45,
  "question_text": "讨论个人收入",
  "explanation_for_creator": "文化差异大。某些国家很开放，某些很保守"
}
```

---

## 📤 提交格式

完成题目后，请：

1. 验证 JSON 格式正确性（使用 [JSONLint](https://jsonlint.com/)）
2. 确保 `id` 唯一且遵循命名规范
3. 将题目添加到对应难度数组中
4. 更新 `total_questions` 总数

---

## 🙏 创作者注意事项

- **保持中立**：避免政治立场、宗教偏见
- **尊重多元**：考虑不同文化背景的玩家
- **测试你的题目**：让朋友试答，看他们的答案是否在你预期范围内
- **持续改进**：根据玩家反馈调整题目

---

## 📞 需要帮助？

如果在创作过程中遇到问题：

1. 查看现有题库中的优秀示例
2. 参考本模板的常见错误部分
3. 向其他创作者请教
4. 从简单难度开始练习

**祝你创作出精彩的题目！** 🎉
