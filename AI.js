// AI-Powered Study Planner JavaScript

// Global variables
let studyPlan = null;
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;
let currentTheme = 'light';

// Gamification variables
let gameStats = JSON.parse(localStorage.getItem('studyPlanner_gameStats')) || {
    totalPoints: 0,
    level: 1,
    lastActivityDate: new Date().toDateString(),
    streakDays: 0,
    unlockedBadges: [],
    totalTasksCompleted: 0,
    totalStudyHours: 0
};

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get elements
    const studyForm = document.getElementById('studyForm');
    const themeToggle = document.getElementById('themeToggle');
    const exportBtn = document.getElementById('exportBtn');
    const difficultySlider = document.getElementById('difficulty');
    const difficultyValue = document.getElementById('difficultyValue');
    const startTimer = document.getElementById('startTimer');
    const pauseTimer = document.getElementById('pauseTimer');
    const resetTimer = document.getElementById('resetTimer');

    // Event listeners
    if (studyForm) {
        studyForm.addEventListener('submit', handleFormSubmit);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportStudyPlan);
    }

    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            difficultyValue.textContent = this.value;
        });
    }

    if (startTimer) {
        startTimer.addEventListener('click', startPomodoroTimer);
    }

    if (pauseTimer) {
        pauseTimer.addEventListener('click', pausePomodoroTimer);
    }

    if (resetTimer) {
        resetTimer.addEventListener('click', resetPomodoroTimer);
    }

    // Load saved data
    loadFromLocalStorage();

    // Initialize AI features
    initializeAIPlanner();

    // Initialize task manager
    initializeTaskManager();

    // Initialize gamification
    initializeGamification();

    // Add motivational quote
    addMotivationalQuote();
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('userName').value,
        goal: document.getElementById('studyGoal').value,
        subjects: document.getElementById('subjects').value.split(',').map(s => s.trim()),
        hours: parseInt(document.getElementById('studyHours').value),
        difficulty: parseInt(document.getElementById('difficulty').value)
    };

    // Generate AI study plan
    studyPlan = generateAIStudyPlan(formData);

    // Save to localStorage
    saveToLocalStorage(formData, studyPlan);

    // Update UI
    updateDashboard(formData, studyPlan);
    updateSchedule(studyPlan);

    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' });

    // AI recommendation
    generateAIRecommendation(formData);
}

// Generate AI-powered study plan
function generateAIStudyPlan(data) {
    const plan = {
        user: data.name,
        goal: data.goal,
        subjects: data.subjects,
        dailyHours: data.hours,
        difficulty: data.difficulty,
        weeklySchedule: generateWeeklySchedule(data),
        tips: generateStudyTips(data),
        createdAt: new Date().toISOString()
    };

    return plan;
}

// Generate weekly schedule
function generateWeeklySchedule(data) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};

    days.forEach(day => {
        const dailyPlan = {
            subjects: data.subjects.slice(0, Math.min(data.subjects.length, Math.ceil(data.hours / 2))),
            hours: data.hours,
            focus: getRandomFocus(data.difficulty)
        };
        schedule[day] = dailyPlan;
    });

    return schedule;
}

// Generate study tips based on difficulty
function generateStudyTips(data) {
    const baseTips = [
        'Use the Pomodoro Technique: 25 minutes study, 5 minutes break',
        'Stay hydrated and take regular breaks',
        'Review material regularly using spaced repetition',
        'Get enough sleep for better memory retention'
    ];

    const difficultyTips = {
        1: ['Start with easy topics to build confidence'],
        2: ['Break complex topics into smaller chunks'],
        3: ['Mix different study methods for better retention'],
        4: ['Focus on understanding concepts, not just memorization'],
        5: ['Seek help from mentors or study groups for challenging topics']
    };

    return [...baseTips, ...difficultyTips[data.difficulty]];
}

// Get random focus area
function getRandomFocus(difficulty) {
    const focuses = [
        'Deep Focus Session',
        'Review and Practice',
        'Problem Solving',
        'Concept Building',
        'Application Practice'
    ];
    return focuses[Math.floor(Math.random() * focuses.length)];
}

// Update dashboard
function updateDashboard(data, plan) {
    document.getElementById('progressText').textContent = '15% Complete';
    document.getElementById('progressBar').style.width = '15%';
    document.getElementById('streakCount').textContent = '3 days';
    document.getElementById('todayGoal').textContent = `${plan.dailyHours} hours of study`;
}

// Update schedule display
function updateSchedule(plan) {
    const scheduleContent = document.getElementById('scheduleContent');
    let html = '<h3>Your Weekly Study Schedule</h3>';

    Object.entries(plan.weeklySchedule).forEach(([day, schedule]) => {
        html += `
            <div class="schedule-day">
                <h4>${day}</h4>
                <p><strong>Subjects:</strong> ${schedule.subjects.join(', ')}</p>
                <p><strong>Hours:</strong> ${schedule.hours}</p>
                <p><strong>Focus:</strong> ${schedule.focus}</p>
            </div>
        `;
    });

    html += '<h3>AI Study Tips</h3><ul>';
    plan.tips.forEach(tip => {
        html += `<li>${tip}</li>`;
    });
    html += '</ul>';

    scheduleContent.innerHTML = html;
}

// Generate AI recommendation
function generateAIRecommendation(data) {
    const recommendations = {
        exam: 'Focus on past papers and practice tests',
        skill: 'Use online tutorials and hands-on projects',
        review: 'Create mind maps and teach concepts to others',
        project: 'Break down the project into milestones'
    };

    const recommendation = recommendations[data.goal] || 'Maintain consistent study habits';
    document.getElementById('aiRecommendation').textContent = recommendation;
}

// Pomodoro Timer Functions
function startPomodoroTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function pausePomodoroTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
}

function resetPomodoroTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        // Timer finished
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        // Award points for completing a study session (25 minutes = 0.417 hours)
        gameStats.totalStudyHours += 0.417;
        awardPoints(25, 'Pomodoro session completed! 📚');
        checkBadgeProgress(); // Check for scholar/dedication badges
        
        alert('Pomodoro session complete! Take a 5-minute break.');
        timeLeft = 5 * 60; // 5 minute break
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Theme toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    document.getElementById('themeToggle').textContent = currentTheme === 'light' ? '🌙' : '☀️';
    saveThemePreference();
}

// Export study plan
function exportStudyPlan() {
    if (!studyPlan) {
        alert('Please generate a study plan first!');
        return;
    }

    const dataStr = JSON.stringify(studyPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `study-plan-${studyPlan.user}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Local Storage functions
function saveToLocalStorage(formData, plan) {
    localStorage.setItem('studyPlanner_userData', JSON.stringify(formData));
    localStorage.setItem('studyPlanner_plan', JSON.stringify(plan));
    localStorage.setItem('studyPlanner_theme', currentTheme);
}

function loadFromLocalStorage() {
    const userData = localStorage.getItem('studyPlanner_userData');
    const planData = localStorage.getItem('studyPlanner_plan');
    const theme = localStorage.getItem('studyPlanner_theme');
    const savedTasks = localStorage.getItem('studyPlanner_tasks');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateTaskStats();
    }

    if (userData && planData) {
        const data = JSON.parse(userData);
        studyPlan = JSON.parse(planData);

        // Populate form
        document.getElementById('userName').value = data.name;
        document.getElementById('studyGoal').value = data.goal;
        document.getElementById('subjects').value = data.subjects.join(', ');
        document.getElementById('studyHours').value = data.hours;
        document.getElementById('difficulty').value = data.difficulty;
        document.getElementById('difficultyValue').textContent = data.difficulty;

        // Update UI
        updateDashboard(data, studyPlan);
        updateSchedule(studyPlan);
        document.getElementById('dashboard').classList.remove('hidden');
    }

    if (theme) {
        currentTheme = theme;
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    }
}

function saveThemePreference() {
    localStorage.setItem('studyPlanner_theme', currentTheme);
}

// Task Management Functions
let tasks = JSON.parse(localStorage.getItem('studyPlanner_tasks')) || [];

function initializeTaskManager() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => addTask(taskInput.value, taskPriority.value));
    }

    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(taskInput.value, taskPriority.value);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterTasks(btn.dataset.filter));
    });

    renderTasks();
    updateTaskStats();
}

function addTask(text, priority) {
    if (!text.trim()) return;

    const task = {
        id: Date.now(),
        text: text.trim(),
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateTaskStats();

    // Clear input
    document.getElementById('taskInput').value = '';

    // AI suggestion for similar tasks
    suggestSimilarTasks(text);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateTaskStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        
        // Award points when task is completed
        if (task.completed) {
            const points = task.priority === 'high' ? 30 : task.priority === 'medium' ? 20 : 10;
            gameStats.totalTasksCompleted++;
            checkDailyActivity(); // Update streak
            awardPoints(points, `Task completed: ${task.text.substring(0, 20)}...`);
            checkBadgeProgress(); // Check for new badges
        }
        
        saveTasks();
        renderTasks();
        updateTaskStats();
    }
}

function filterTasks(filter) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderTasks(filter);
}

function renderTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    let filteredTasks = tasks;

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Sort by priority (high first) and then by creation date
    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        </li>
    `).join('');
}

function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

function saveTasks() {
    localStorage.setItem('studyPlanner_tasks', JSON.stringify(tasks));
}

function suggestSimilarTasks(taskText) {
    // Simple AI-like suggestions based on keywords
    const suggestions = {
        'math': ['Practice algebra problems', 'Review calculus concepts', 'Solve geometry puzzles'],
        'physics': ['Study mechanics', 'Learn thermodynamics', 'Practice electricity problems'],
        'programming': ['Code a small project', 'Learn a new framework', 'Debug existing code'],
        'study': ['Review notes', 'Take practice quiz', 'Create flashcards'],
        'exam': ['Review past papers', 'Practice time management', 'Focus on weak areas']
    };

    const lowerText = taskText.toLowerCase();
    let suggestedTasks = [];

    Object.keys(suggestions).forEach(keyword => {
        if (lowerText.includes(keyword)) {
            suggestedTasks = suggestions[keyword];
        }
    });

    if (suggestedTasks.length > 0 && Math.random() < 0.3) { // 30% chance to show suggestion
        setTimeout(() => {
            const suggestion = suggestedTasks[Math.floor(Math.random() * suggestedTasks.length)];
            if (confirm(`🤖 AI Suggestion: Would you like to add "${suggestion}" as a related task?`)) {
                addTask(suggestion, 'medium');
            }
        }, 1000);
    }
}

// Gamification System
const BADGES = {
    firstTask: { icon: '🎯', name: 'First Step', desc: 'Complete your first task', points: 10, condition: () => gameStats.totalTasksCompleted >= 1 },
    taskMaster: { icon: '✅', name: 'Task Master', desc: 'Complete 10 tasks', points: 50, condition: () => gameStats.totalTasksCompleted >= 10 },
    taskChampion: { icon: '🏆', name: 'Task Champion', desc: 'Complete 50 tasks', points: 100, condition: () => gameStats.totalTasksCompleted >= 50 },
    fireStarter: { icon: '🔥', name: 'Fire Starter', desc: 'Achieve 3-day streak', points: 30, condition: () => gameStats.streakDays >= 3 },
    onFire: { icon: '🌪️', name: 'On Fire!', desc: 'Achieve 7-day streak', points: 100, condition: () => gameStats.streakDays >= 7 },
    legendary: { icon: '⭐', name: 'Legendary', desc: 'Achieve 30-day streak', points: 500, condition: () => gameStats.streakDays >= 30 },
    scholar: { icon: '📚', name: 'Scholar', desc: 'Study 10 hours', points: 75, condition: () => gameStats.totalStudyHours >= 10 },
    dedication: { icon: '💪', name: 'Dedication', desc: 'Study 50 hours', points: 200, condition: () => gameStats.totalStudyHours >= 50 },
    speedster: { icon: '⚡', name: 'Speedster', desc: 'Complete 5 tasks in a day', points: 40, condition: () => true }, // Checked separately
    earlyBird: { icon: '🌅', name: 'Early Bird', desc: 'Study before 9 AM', points: 20, condition: () => true }, // Checked separately
    nightOwl: { icon: '🦉', name: 'Night Owl', desc: 'Study after 6 PM', points: 20, condition: () => true }, // Checked separately
};

const LEVEL_THRESHOLDS = {
    1: 0,
    2: 500,
    3: 1500,
    4: 3000,
    5: 5000,
    6: 7500,
    7: 10000,
    8: 15000,
    9: 20000,
    10: 50000
};

const LEVEL_NAMES = {
    1: '🥚 Beginner',
    2: '🌱 Growing',
    3: '🎓 Student',
    4: '📖 Scholar',
    5: '🔬 Expert',
    6: '👨‍🎓 Master',
    7: '🧙 Sage',
    8: '🌟 Legend',
    9: '👑 Elite',
    10: '🚀 Ultimate'
};

function initializeGamification() {
    updateStreakCounter();
    checkDailyActivity();
    renderGameUI();
}

function saveGameStats() {
    localStorage.setItem('studyPlanner_gameStats', JSON.stringify(gameStats));
}

function awardPoints(points, reason) {
    gameStats.totalPoints += points;
    saveGameStats();
    updateLevel();
    showNotification(`+${points} XP earned! ${reason}`);
}

function updateLevel() {
    let newLevel = 1;
    for (let level = 10; level >= 1; level--) {
        if (gameStats.totalPoints >= LEVEL_THRESHOLDS[level]) {
            newLevel = level;
            break;
        }
    }
    gameStats.level = newLevel;
    saveGameStats();
    updateGameUI();
}

function updateStreakCounter() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (gameStats.lastActivityDate !== today) {
        if (gameStats.lastActivityDate === yesterday) {
            gameStats.streakDays++;
        } else {
            gameStats.streakDays = 1;
        }
        gameStats.lastActivityDate = today;
        saveGameStats();
    }
}

function checkDailyActivity() {
    updateStreakCounter();
    const now = new Date();
    
    // Check time-based achievements (Early Bird, Night Owl) - happens on first activity
    if (now.getHours() < 9) {
        unlockBadge('earlyBird');
    }
    if (now.getHours() >= 18) {
        unlockBadge('nightOwl');
    }
}

function unlockBadge(badgeKey) {
    if (!gameStats.unlockedBadges.includes(badgeKey) && BADGES[badgeKey]) {
        gameStats.unlockedBadges.push(badgeKey);
        awardPoints(BADGES[badgeKey].points, `Badge unlocked: ${BADGES[badgeKey].name}`);
        showNotification(`🎉 Badge Unlocked: ${BADGES[badgeKey].name}`);
    }
}

function checkBadgeProgress() {
    // Check task-related badges
    if (gameStats.totalTasksCompleted === 1) unlockBadge('firstTask');
    if (gameStats.totalTasksCompleted === 10) unlockBadge('taskMaster');
    if (gameStats.totalTasksCompleted === 50) unlockBadge('taskChampion');
    
    // Check streak badges
    if (gameStats.streakDays === 3) unlockBadge('fireStarter');
    if (gameStats.streakDays === 7) unlockBadge('onFire');
    if (gameStats.streakDays === 30) unlockBadge('legendary');
    
    // Check study hour badges
    if (gameStats.totalStudyHours === 10) unlockBadge('scholar');
    if (gameStats.totalStudyHours === 50) unlockBadge('dedication');
}

function renderGameUI() {
    // Update points and level
    document.getElementById('totalPoints').textContent = gameStats.totalPoints;
    document.getElementById('userLevel').textContent = LEVEL_NAMES[gameStats.level] || '🥚 Beginner';
    document.getElementById('streakDisplay').textContent = `🔥 ${gameStats.streakDays} days`;
    
    // Update level progress bar
    const currentLevelXP = LEVEL_THRESHOLDS[gameStats.level];
    const nextLevelXP = LEVEL_THRESHOLDS[gameStats.level + 1] || LEVEL_THRESHOLDS[10];
    const progressPercent = ((gameStats.totalPoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    document.getElementById('levelProgress').style.width = Math.min(progressPercent, 100) + '%';
    document.getElementById('progressText').textContent = `${gameStats.totalPoints - currentLevelXP} / ${nextLevelXP - currentLevelXP} XP to next level`;
    
    // Render badges
    renderBadges();
    
    // Render rewards
    renderRewards();
}

function updateGameUI() {
    renderGameUI();
}

function renderBadges() {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    Object.entries(BADGES).forEach(([key, badge]) => {
        const isUnlocked = gameStats.unlockedBadges.includes(key);
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge ${!isUnlocked ? 'locked' : ''}`;
        badgeEl.title = `${badge.name}: ${badge.desc}`;
        badgeEl.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.desc}</div>
        `;
        badgesContainer.appendChild(badgeEl);
    });
}

function renderRewards() {
    const rewardsContainer = document.getElementById('rewardsContainer');
    if (!rewardsContainer) return;
    
    const rewards = [
        { title: '🎯 Early Achiever', desc: 'Unlock 3 badges' },
        { title: '📈 Level 5', desc: 'Reach level 5' },
        { title: '🔔 Consistent', desc: 'Maintain 7-day streak' },
        { title: '🌟 Ultimate', desc: 'Reach max level' }
    ];
    
    rewardsContainer.innerHTML = '';
    
    const unlockedCount = gameStats.unlockedBadges.length;
    const reachedLevel5 = gameStats.level >= 5;
    const maintained7Streak = gameStats.streakDays >= 7;
    
    rewards.forEach((reward, idx) => {
        const rewardEl = document.createElement('div');
        rewardEl.className = 'reward-item';
        
        let completed = false;
        if (idx === 0) completed = unlockedCount >= 3;
        if (idx === 1) completed = reachedLevel5;
        if (idx === 2) completed = maintained7Streak;
        if (idx === 3) completed = gameStats.level === 10;
        
        if (!completed) {
            rewardEl.style.opacity = '0.5';
        }
        
        rewardEl.innerHTML = `
            <div class="reward-title">${reward.title} ${completed ? '✓' : '🔒'}</div>
            <div class="reward-desc">${reward.desc}</div>
        `;
        rewardsContainer.appendChild(rewardEl);
    });
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize AI Planner functionality
function initializeAIPlanner() {
    console.log('🤖 AI Study Planner initialized');

    // Simulate AI thinking
    setTimeout(() => {
        console.log('🧠 AI: Analyzing optimal study patterns...');
    }, 1000);

    setTimeout(() => {
        console.log('📊 AI: Optimizing schedule based on user preferences...');
    }, 2000);
}

// Add a random motivational quote
function addMotivationalQuote() {
    const quotes = [
        "Success is the sum of small efforts, repeated day in and day out.",
        "The only way to do great work is to love what you do.",
        "Believe you can and you're halfway there.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Study is not just about the hours you put in, but the passion you bring.",
        "Every expert was once a beginner. Keep learning!",
        "Your brain is like a muscle - the more you use it, the stronger it gets."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivationalQuote').textContent = `"${randomQuote}"`;
}