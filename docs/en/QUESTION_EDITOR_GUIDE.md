# Question Bank Editor Guide

A user-friendly visual editor for managing Wavelength questions without editing raw JSON.

## 🚀 Quick Start

1. Open the editor in your browser:
   ```
   http://localhost:8080/public/question-editor.html
   ```

2. The editor will automatically load your existing questions from `question_bank.json`

3. Start creating, editing, or organizing questions!

## ✨ Features

### Visual Question Management
- **Card-based view** - See all your questions at a glance
- **Color-coded topics** - Left topic (blue) and right topic (red)
- **Visual position slider** - Set target position with a visual slider
- **Real-time stats** - Track total questions and questions per creator

### Easy Editing
- ✏️ **Add New Questions** - Simple form interface
- 📝 **Edit Existing** - Click edit button on any question
- 🗑️ **Delete Questions** - Remove questions with confirmation
- 🔍 **Search & Filter** - Find questions by text or creator

### Import/Export
- 💾 **Export JSON** - Generate formatted JSON ready to use
- 📋 **Copy to Clipboard** - One-click copy
- ⬇️ **Download File** - Save directly as `question_bank.json`
- 📂 **Import JSON** - Load existing question bank

## 📝 Adding a New Question

1. Click **"➕ Add New Question"**

2. Fill in the form:
   - **Question Text**: What players should guess about
   - **Left Topic**: The left end of the spectrum (e.g., "冷")
   - **Right Topic**: The right end of the spectrum (e.g., "热")
   - **Target Position**: Use the slider to set where the answer falls (0-100)
   - **Creator**: Your name or the creator's name

3. Click **"💾 Save Question"**

4. Your question appears in the list!

## ✏️ Editing a Question

1. Find the question you want to edit
2. Click the **"✏️ Edit"** button
3. Update any fields in the form
4. Click **"💾 Save Question"**

## 🗑️ Deleting a Question

1. Find the question you want to delete
2. Click the **"🗑️ Delete"** button
3. Confirm the deletion

## 💾 Exporting Your Changes

### Method 1: Copy & Paste
1. Click **"💾 Export JSON"**
2. Click **"📋 Copy to Clipboard"**
3. Open `/public/data/question_bank.json` in your text editor
4. Paste the new content
5. Save the file

### Method 2: Download
1. Click **"💾 Export JSON"**
2. Click **"⬇️ Download File"**
3. Replace the old `question_bank.json` with the downloaded file

## 🔍 Search & Filter

### Search Box
Type in the search box to filter questions by:
- Question text
- Topic words
- Creator name
- Question ID

### Creator Filter
Use the dropdown to show only questions from a specific creator.

## 📊 Understanding the Interface

### Question Card
Each question is displayed as a card showing:
- **Question ID** - Unique identifier
- **Creator Badge** - Who created the question
- **Question Text** - The main question
- **Topic Pair** - Left ↔ Right spectrum endpoints
- **Target Position** - Visual bar showing where the answer falls

### Stats Bar
At the top, you'll see:
- **Total Questions** - How many questions in total
- **By Creator** - Breakdown of questions per creator

## 🎨 Color Coding

- **Blue boxes** - Left topic (spectrum start)
- **Red boxes** - Right topic (spectrum end)
- **Purple accents** - Primary UI elements
- **Black marker** - Target position on the spectrum

## 📋 JSON Structure

The editor maintains the same structure as the original JSON:

```json
{
  "creators": {
    "CreatorName": {
      "description": "Questions by CreatorName",
      "questions": [
        {
          "id": "q_1234567890_abc123",
          "question_text": "Your question here",
          "topic_pair": "冷 ↔ 热",
          "target_position": 45
        }
      ]
    }
  },
  "total_questions": 30
}
```

## 💡 Tips & Best Practices

### Creating Good Questions

1. **Clear topics** - Make spectrum endpoints obvious opposites
   - ✅ Good: "冷 ↔ 热" (Cold ↔ Hot)
   - ❌ Bad: "蓝色 ↔ 快乐" (Blue ↔ Happy)

2. **Interesting positions** - Avoid too many questions at 0, 50, or 100
   - Try: 23, 67, 81 for more variety

3. **Vary difficulty** - Mix obvious and thought-provoking questions

4. **Test your questions** - Play them in-game to ensure they work well

### Organization

1. **Use descriptive creators** - Makes filtering easier
   - "Sean_Easy", "Sean_Hard"
   - "Food_Questions", "Emotion_Questions"

2. **Consistent naming** - Use a pattern for question IDs
   - The editor auto-generates IDs, but you can customize them

3. **Backup often** - Export your JSON regularly

## 🔧 Troubleshooting

### Questions not loading?
- Check browser console (F12) for errors
- Make sure `question_bank.json` is in `/public/data/`
- Verify the JSON is valid

### Can't save?
- All required fields must be filled
- Creator name cannot be empty
- Target position must be 0-100

### Lost changes?
- The editor doesn't auto-save to the file
- Always export your JSON when done editing
- Import your existing file first before making changes

## 🚀 Workflow Example

### Adding 10 New Questions

1. Open the editor
2. Existing questions load automatically
3. Click "Add New Question" and fill in Question #1
4. Click "Save Question"
5. Repeat for Questions #2-10
6. Click "Export JSON"
7. Copy to clipboard or download
8. Replace your `question_bank.json` file
9. Refresh your game to see the new questions!

### Bulk Editing

1. Export your current JSON
2. Edit multiple questions in the editor
3. Export the updated JSON
4. Replace the file
5. Done!

## 🎯 Keyboard Shortcuts

- **Tab** - Move between form fields
- **Enter** - Submit form (when in text input)
- **Escape** - Close modal (if implemented)

## 📱 Mobile Support

The editor works on mobile devices:
- Touch-friendly buttons
- Responsive layout
- Swipe-friendly modals

## 🔒 Security Note

This is a **client-side editor** - all changes happen in your browser. Your edits are **not saved automatically** to the server. You must export and save the JSON file manually.

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your `question_bank.json` is valid JSON
3. Try importing a fresh copy of the file
4. Clear browser cache and reload

---

**Happy Question Creating! 🎉**

The editor makes it easy to build a great question bank for your Wavelength game!
