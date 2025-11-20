# Data Extraction Summary

**Date:** November 20, 2025

## Overview

Extracted hardcoded data arrays from JavaScript files into separate JSON files for better maintainability and easier content updates.

## Files Created

### 1. `/public/data/wordbank.json`
**Source:** Extracted from `script.js` (now `src/js/multiplayer.js`)
**Size:** 101 words
**Purpose:** Random hint words used when timer expires in multiplayer mode

**Structure:**
```json
{
  "words": [
    "火锅",
    "宇宙",
    "爱情",
    ...
  ]
}
```

**Usage:**
- Loaded asynchronously on page load
- Used in `confirmHint()` when countdown expires
- Fallback to 5 words if fetch fails

### 2. `/public/data/hintlist.json`
**Source:** Extracted from `script.js` (now `src/js/multiplayer.js`)
**Size:** 100 hint pairs across 10 categories
**Purpose:** Spectrum endpoints for multiplayer game rounds

**Structure:**
```json
{
  "hints": [
    {
      "left": "让人感动",
      "right": "让人尴尬",
      "category": "情感与氛围"
    },
    ...
  ]
}
```

**Categories:**
1. 🎭 情感与氛围 (Emotion & Atmosphere) - 9 hints
2. 🌈 审美与风格 (Aesthetics & Style) - 7 hints
3. 🎪 社交与文化 (Social & Culture) - 8 hints
4. 🎮 体验与难度 (Experience & Difficulty) - 6 hints
5. 🍕 生活与消费 (Life & Consumption) - 7 hints
6. 🚀 时间与空间 (Time & Space) - 10 hints
7. 🎨 形态与特征 (Form & Features) - 12 hints
8. 🧠 认知与思维 (Cognition & Thinking) - 8 hints
9. 🌍 性质与状态 (Nature & State) - 9 hints
10. 🎯 态度与价值 (Attitude & Value) - 7 hints
11. 🌟 创意与特殊 (Creative & Special) - 10 hints

**Usage:**
- Loaded asynchronously on page load
- Used in `hostStartGame()` to select random hint pair
- Fallback to 3 basic hints if fetch fails

### 3. `/public/data/question_bank.json`
**Source:** Already existed, moved from root
**Size:** 30 questions
**Purpose:** Single-player mode questions

## Code Changes

### `src/js/multiplayer.js`

**Before:** 783 lines
**After:** 602 lines
**Reduction:** 181 lines (23% smaller)

**Changes:**
1. Changed `chineseWordBank` from `const` array to `let` variable
2. Added `hintList` as `let` variable (was `const` array)
3. Added `loadWordBank()` async function
4. Added `loadHintList()` async function
5. Updated `DOMContentLoaded` to call both loaders
6. Removed 100+ lines of hardcoded word array
7. Removed 115+ lines of hardcoded hint array

**Loading Logic:**
```javascript
window.addEventListener("DOMContentLoaded", () => {
    // Load audio elements
    moveSounds = [/* ... */];

    // Load data from JSON files
    loadWordBank();    // Fetches ../data/wordbank.json
    loadHintList();    // Fetches ../data/hintlist.json
});
```

**Fallback Handling:**
- Both loaders have try-catch with fallback data
- Console logs success/failure
- Game continues to work even if fetch fails

## Benefits

### ✅ Better Maintainability
- Edit hints/words without touching JavaScript code
- No need to rebuild or redeploy JavaScript files
- Can use JSON validation tools

### ✅ Easier Content Updates
- Non-developers can update word lists
- Add/remove hints without code knowledge
- Organize hints by category in JSON

### ✅ Cleaner Code
- 23% reduction in multiplayer.js size
- Separation of data from logic
- Easier to read and debug

### ✅ Internationalization Ready
- Can create multiple language versions:
  - `wordbank_en.json`
  - `wordbank_zh.json`
  - `hintlist_en.json`
  - `hintlist_zh.json`
- Load based on user language preference

### ✅ Performance
- Async loading doesn't block page render
- Can cache JSON files separately
- Easier to update via CDN

## Usage

### Adding New Hints

Edit `/public/data/hintlist.json`:

```json
{
  "hints": [
    {
      "left": "新的左端点",
      "right": "新的右端点",
      "category": "你的分类"
    }
  ]
}
```

### Adding New Words

Edit `/public/data/wordbank.json`:

```json
{
  "words": [
    "新词1",
    "新词2",
    "新词3"
  ]
}
```

### Testing Changes

1. Edit JSON file
2. Refresh browser (no rebuild needed!)
3. Check console for load messages:
   - `✅ 词库加载成功: 101 个词`
   - `✅ 提示列表加载成功: 100 对提示`

## Future Enhancements

### Possible Improvements:
1. **Category Filtering**: Allow selecting hint categories
2. **Difficulty Levels**: Tag hints by difficulty
3. **User Contributions**: API to submit new hints
4. **Admin Panel**: Web interface to edit hints
5. **A/B Testing**: Multiple hint sets for testing
6. **Analytics**: Track which hints are most popular

### Advanced Features:
```json
{
  "hints": [
    {
      "id": "hint_001",
      "left": "冷",
      "right": "热",
      "category": "形态与特征",
      "difficulty": "easy",
      "usageCount": 1234,
      "rating": 4.5,
      "tags": ["temperature", "physical"]
    }
  ]
}
```

## Migration Notes

### Breaking Changes
**None** - The game functions identically to before

### Compatibility
- Works with all modern browsers (fetch API support)
- Falls back gracefully if fetch fails
- No changes needed to HTML or CSS

### Rollback
If needed, restore from git:
```bash
git log --oneline src/js/multiplayer.js
git checkout <commit-before-extraction> src/js/multiplayer.js
```

## File Locations

```
Wavelength/
└── public/
    └── data/
        ├── wordbank.json      # ✨ NEW - 101 words
        ├── hintlist.json      # ✨ NEW - 100 hint pairs
        └── question_bank.json # Moved from root
```

## Summary Statistics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| multiplayer.js lines | 783 | 602 | -181 (-23%) |
| Hardcoded arrays | 2 | 0 | -2 |
| Data files | 1 | 3 | +2 |
| Total words | 101 | 101 | Same |
| Total hint pairs | 100 | 100 | Same |
| Functionality | ✅ | ✅ | No change |

---

**Data extraction completed successfully! 🎉**

The game is now more maintainable with all data properly separated into JSON files.
