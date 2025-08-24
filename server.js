// Express Server Entry Point
const express = require('express');
const { loadTasks, loadUsers, saveTasks } = require('./bouns');
const QueryString = require('qs');

const app = express();
const PORT = 6060;

// Local Database
const tasks = [];
const users = [];

loadTasks(tasks, "data/tasks.json");
loadUsers(users, "data/users.json");

// Middleware
app.use(express.json());

// Routes
app.get('/api/tasks', (req, res) => {
    
   res.json(tasks);
    // should get all tasks from tasks array
});

app.get('/api/tasks/search', (req, res) => {
    // query string should contain keyword and we should search in tasks array using this keyword
    // If the keyword exists on title or description we should respond with this task
   const keyword = req.query.keyword;
   const filteredTasks = tasks.filter(task => task.title.includes(keyword) || task.description.includes(keyword));
   res.json(filteredTasks);
});

app.post('/api/tasks', (req, res) => {
    // body should contain these info title, description, priority(high, low, medium)
   const { title, description, priority } = req.body;
   const task = { title, description, priority };
   if (!title || !description || !priority) {
       res.json({ error: "All fields are required" });
       return;
   }
   if (priority !== "high" && priority !== "low" && priority !== "medium") {
       res.json({ error: "Invalid priority" });
       return;
   }
   tasks.push(task);
    // KEEP THIS CODE AFTER ADDING TASK TO TASKS ARRAY
   saveTasks(tasks, "data/tasks.json");
   res.json(task);
});

app.get("/profile", (req, res)  => {
    // we get query string from req and search user in users array
    const keyword = req.query.keyword;
    const filteredUsers = users.filter(user => user.username.includes(keyword) || user.email.includes(keyword));
    res.json(filteredUsers);
});

app.post("/register", (req, res) => {
    // body should contain these info username, email, password
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ error: "All fields are required" });

    }
    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        return res.json({ error: "User already exists" });

    }
    const user = { username, email, password };
    users.push(user);
    // KEEP THIS CODE AFTER ADDING USER TO USERS ARRAY
    res.json({ message: "User registered successfully", user });
    saveTasks(users, "data/users.json");

});

app.post("/login", (req, res) => {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
        return res.json({ error: "All fields are required" });
    }
    const user = users.find(user => user.username === username || user.email === email);
    if (!user) {
        return res.json({ error: "User not found" });
    }
    if (user.password !== password) {
        return res.json({ error: "Invalid password" });
    }
    res.json({ message: "User logged in successfully", user });
    // body should contain these info username or email, password
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
