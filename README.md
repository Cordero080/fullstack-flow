# Full-Stack Data Flow Visualizer

An interactive React application that visualizes the complete request-response cycle in a full-stack web application. Built as a study tool to understand how data travels from user click to database and back.

![Full-Stack Flow Demo](./demo-screenshot.png)

##  Purpose

Understanding how frontend, backend, and database communicate is fundamental for any developer. This tool provides:

- **Visual representation** of the entire data lifecycle
- **Real code examples** at each step (React, Django, SQL)
- **File context** showing which files handle each action
- **Animated flow** to watch data travel through the system

Perfect for:
- Bootcamp students learning full-stack architecture
- Junior developers solidifying their understanding
- Technical interviews (explain the request-response cycle)
- Teaching and presentations

## 🔄 The Data Flow

```
USER CLICK → FRONTEND → BROWSER → BACKEND → DATABASE
                                              ↓
UI RENDER ← FRONTEND ← HTTP RESPONSE ← BACKEND ← DB RESPONSE
```

### 9 Steps Visualized:

| Step | Action | Files Involved |
|------|--------|----------------|
| 1. User Click | UI Event triggered | `PostForm.jsx`, `Feed.jsx` |
| 2. Frontend | JS handler executes | `PostForm.jsx`, `usePostForm.js` |
| 3. Browser | HTTP Request created | `api.js`, `postService.js` |
| 4. Backend Server | Route handles request | `urls.py`, `views.py`, `serializers.py` |
| 5. Database | SQL query executes | `models.py`, `migrations/` |
| 6. DB Response | Data rows returned | `models.py`, `serializers.py` |
| 7. Backend Server | JSON response formed | `views.py`, `serializers.py` |
| 8. HTTP Response | Network transit | `api.js`, `postService.js` |
| 9. Frontend Renders | DOM updates | `PostList.jsx`, `PostCard.jsx` |

## 🛠️ Tech Stack

- **React** - UI components
- **SCSS** - Styled with BEM methodology
- **Custom Hooks** - Animation logic abstracted
- **Vite** (or CRA) - Build tooling

## 📁 Project Structure

```
src/
├── components/
│   ├── FullStackFlow/
│   │   ├── index.jsx              # Main component
│   │   ├── FullStackFlow.scss     # Component styles
│   │   ├── FlowNode.jsx           # Clickable node
│   │   ├── FlowArrow.jsx          # Arrow connector
│   │   ├── CodePanel.jsx          # Code example display
│   │   ├── DataFormatLabels.jsx   # HTTP/JSON/SQL labels
│   │   └── FlowLegend.jsx         # Bottom legend
│   └── ui/
│       └── Button.jsx             # Reusable button
├── data/
│   └── flowNodes.js               # Node data & code examples
├── hooks/
│   └── useFlowAnimation.js        # Animation custom hook
├── styles/
│   ├── _variables.scss            # Colors, spacing
│   ├── _mixins.scss               # Glassmorphism, transitions
│   └── global.scss                # Base styles
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/fullstack-flow-visualizer.git

# Navigate to project
cd fullstack-flow-visualizer

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🎨 Features

### Interactive Nodes
Click any node to reveal:
- Explanation of what happens at that step
- Real code examples (React handlers, Django views, SQL queries)
- Files involved in a real project

### Animate Flow
Watch data travel through the entire system with the "Animate Flow" button. Each step highlights sequentially (800ms intervals).

### Data Format Labels
Visual indicators showing how data transforms:
- `HTTP Request` → `JSON/REST` → `SQL Query`
- `JSON Response` → `DOM Update`

### Dark Theme
Easy on the eyes, perfect for late-night study sessions.

## 📸 Screenshots

### Flow Diagram
![Flow Diagram](./screenshots/flow-diagram.png)

### Code Panel Expanded
![Code Panel](./screenshots/code-panel.png)

### Animation in Progress
![Animation](./screenshots/animation.png)

## 🧠 Learning Objectives

After using this tool, you should understand:

1. **Frontend → Backend communication**
   - How `fetch()` constructs HTTP requests
   - What headers and body contain
   - How async/await handles the response

2. **Backend request handling**
   - URL routing to views
   - Request validation with serializers
   - ORM interaction with database

3. **Database operations**
   - What SQL the ORM generates
   - How data is stored and retrieved
   - What gets returned to the backend

4. **Response cycle**
   - How JSON is formatted and sent
   - How frontend receives and parses response
   - How React state updates trigger re-renders

## 🔧 Customization

### Add Your Own Stack

Edit `src/data/flowNodes.js` to customize:

```javascript
// Change Django to Express.js
{
  id: 'backend',
  label: 'Backend Server',
  files: ['server/routes/posts.js', 'server/controllers/postController.js'],
  code: `
// server/routes/posts.js
router.post('/posts', postController.create);

// server/controllers/postController.js
exports.create = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
};
  `
}
```

### Change Colors

Edit `src/styles/_variables.scss`:

```scss
$node-colors: (
  'user-click': #6366f1,
  'frontend': #8b5cf6,
  'browser': #a855f7,
  // ... customize your palette
);
```

## 🤝 Contributing

Contributions welcome! Ideas for expansion:

- [ ] Add Express.js/Node backend examples
- [ ] Add MongoDB query examples
- [ ] Add authentication flow (JWT)
- [ ] Add error handling path visualization
- [ ] Add GraphQL alternative flow
- [ ] Add WebSocket real-time flow

## 📝 License

MIT License - feel free to use for learning, teaching, or portfolio.

## 🙏 Acknowledgments

- Built during General Assembly Software Engineering Bootcamp
- Inspired by the need to visualize abstract concepts
- NUMENEON project vibes 🌊

---

**Created by Pablo** | [Portfolio](https://yourportfolio.com) | [LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/yourusername)
