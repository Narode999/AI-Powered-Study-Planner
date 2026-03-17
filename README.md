# 🧠 AI-Powered Study Planner

An interactive web application that helps students study smarter with AI-powered planning and gamified motivation.

**Live Demo:** https://tangerine-sfogliatella-de73e3.netlify.app/

---

## ✨ Features

### 📚 Study Planning
- **AI-Generated Study Plans** — Personalized schedules based on your goals, subjects, and difficulty level
- **Smart Scheduling** — Weekly study timetables with optimized focus sessions
- **Goal-Based Planning** — Choose from exam prep, skill learning, material review, or project work

### ✅ Task Management
- **Priority Levels** — Organize tasks by Low, Medium, and High priority
- **Smart Filtering** — View all tasks, only pending, or completed
- **Quick Add** — Add tasks with a single click or press Enter
- **Task Tracking** — Visual completion status with checkboxes

### ⏱️ Pomodoro Timer
- **25-Minute Focus Sessions** — Based on the proven Pomodoro Technique
- **Session Controls** — Start, pause, and reset functionality
- **Auto-Rewards** — Earn XP points for completing study sessions

### 🏆 Gamification System
- **11 Achievement Badges** — Unlock rewards for reaching milestones
  - First Step, Task Master, Task Champion
  - Fire Starter, On Fire, Legendary
  - Scholar, Dedication, Speedster, Early Bird, Night Owl
- **10-Level Progression** — From 🥚 Beginner to 🚀 Ultimate
- **XP Points System** — Earn points for tasks and study sessions
- **Daily Streaks** — Maintain motivation with streak tracking

### 📊 Dashboard & Analytics
- **Progress Tracking** — Visual progress bar to next level
- **Statistics Display** — Points, level, streaks, and goals
- **Study Insights** — AI recommendations based on your activity

### 🎨 UI/UX Features
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works perfectly on desktop, tablet, and mobile
- **Modern Aesthetic** — Purple/Blue gradient with smooth animations
- **Data Persistence** — All your data is saved locally (no account needed)

---

## 🛠️ Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, Grid, animations, gradients, media queries
- **JavaScript (ES6+)** — DOM manipulation, event handling, state management
- **LocalStorage API** — Data persistence without a backend

---

## 🚀 How to Use

### Online (Live Demo)
Simply visit: https://tangerine-sfogliatella-de73e3.netlify.app/

### Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Narode999/AI-Powered-Study-Planner.git
   cd AI-Powered-Study-Planner
   ```

2. Open `index.html` in your browser

3. Start planning and studying!

---

## 📖 Getting Started

### Create a Study Plan
1. Enter your name and study goal
2. List subjects/areas you want to study
3. Set daily study hours and difficulty level
4. Click "Generate AI Study Plan"

### Manage Tasks
1. Type a task in the input field
2. Select priority level
3. Click "Add Task" or press Enter
4. Complete tasks to earn XP and unlock badges

### Use the Pomodoro Timer
1. Click "Start" to begin a 25-minute study session
2. Focus on your work
3. Take a 5-minute break when the timer ends
4. Earn points for each completed session

### Track Your Progress
- Monitor your XP points and current level
- View unlocked badges on the achievements page
- Maintain daily streaks for motivation
- Check your AI recommendations

---

## 🎓 What I Learned

Building this project helped me master:

- **JavaScript Fundamentals**
  - DOM manipulation & event listeners
  - Array methods (map, filter, find, forEach)
  - Object manipulation and spread operator
  - Closures and function scope

- **State Management**
  - Managing complex application state
  - Using localStorage for data persistence
  - Tracking user progress across sessions

- **UI/UX Design**
  - Creating responsive layouts with CSS Grid & Flexbox
  - Implementing accessible color contrasts
  - Designing intuitive user interfaces
  - Mobile-first design approach

- **Game Mechanics**
  - Implementing achievement systems
  - Creating progression mechanics (levels, XP)
  - Maintaining streak counters
  - Designing motivational feedback systems

- **Web Development Best Practices**
  - Clean, readable code structure
  - Performance optimization
  - Cross-browser compatibility
  - Git version control

---

## 📁 Project Structure

```
AI-Powered-Study-Planner/
├── index.html          # Main HTML structure
├── style.css           # All styling (responsive + dark mode)
├── AI.js              # JavaScript logic (gamification, tasks, timer)
└── README.md          # Documentation
```

---

## 🎯 Key Code Examples

### Task Completion with XP Reward
```javascript
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        
        if (task.completed) {
            const points = task.priority === 'high' ? 30 : 
                          task.priority === 'medium' ? 20 : 10;
            gameStats.totalTasksCompleted++;
            awardPoints(points, `Task completed: ${task.text}`);
            checkBadgeProgress();
        }
        
        saveTasks();
        renderTasks();
    }
}
```

### Badge Unlock System
```javascript
function unlockBadge(badgeKey) {
    if (!gameStats.unlockedBadges.includes(badgeKey)) {
        gameStats.unlockedBadges.push(badgeKey);
        awardPoints(BADGES[badgeKey].points, `Badge unlocked!`);
        showNotification(`🎉 Badge Unlocked: ${BADGES[badgeKey].name}`);
    }
}
```

---

## 🌟 Future Enhancements

Potential features to add:
- [ ] Export study plans as PDF
- [ ] Sync progress with cloud storage
- [ ] Study notes with rich text editor
- [ ] Calendar view for visual scheduling
- [ ] Analytics dashboard with charts
- [ ] Sharing study plans with friends
- [ ] Backend integration for accounts
- [ ] Mobile app version

---

## 📱 Browser Support

Works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

---

## 💡 Tips for Best Results

1. **Set realistic goals** — Choose achievable difficulty levels
2. **Use the timer** — Pomodoro sessions work best for focus
3. **Maintain streaks** — Consistency builds momentum
4. **Review badges** — They show your progress visually
5. **Experiment with dark mode** — Reduce eye strain during late-night studying

---

## 🤝 Contributing

Suggestions and feedback are welcome! Feel free to:
- Report bugs
- Suggest features
- Contribute improvements

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👤 About Me

I'm learning web development by building real projects. This study planner reflects my understanding of:
- Frontend development fundamentals
- User experience design
- Problem-solving through code

**GitHub:** https://github.com/Narode999  
**LinkedIn:** [Your LinkedIn Profile]

---

## 🙏 Acknowledgments

- Built with vanilla JavaScript (no frameworks)
- Inspired by productivity and gamification principles
- Designed for students who want to study smarter

---

## ⭐ If you found this helpful, please star the repo!

**Happy studying! 📚✨**
