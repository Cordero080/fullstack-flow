import React, { useState, useEffect } from 'react';

const FullStackFlow = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);

  const nodes = [
    {
      id: 'user-click',
      label: 'User Click',
      sublabel: 'UI Event',
      color: '#6366f1',
      code: `// User clicks "Create Post" button
<button onClick={handleSubmit}>
  Create Post
</button>`,
      explanation: 'The journey begins when a user interacts with the UI—clicking a button, submitting a form, or triggering any event.'
    },
    {
      id: 'frontend',
      label: 'Frontend',
      sublabel: 'JS Execution',
      detail: 'HTML/CSS/JavaScript',
      color: '#8b5cf6',
      code: `// Event handler captures the action
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const postData = {
    title: title,
    content: content,
    author: currentUser.id
  };
  
  // Call the API service
  const response = await createPost(postData);
  
  if (response.ok) {
    setPosts([...posts, response.data]);
  }
};`,
      explanation: 'JavaScript captures the event, gathers form data, validates it client-side, and prepares to send it to the server.'
    },
    {
      id: 'browser',
      label: 'Browser',
      sublabel: 'Request Creation',
      color: '#a855f7',
      code: `// fetch() or axios makes the HTTP request
const createPost = async (postData) => {
  const response = await fetch('/api/posts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify(postData)
  });
  
  return response.json();
};

// What actually gets sent:
// POST /api/posts/ HTTP/1.1
// Content-Type: application/json
// {"title":"My Post","content":"Hello!","author":1}`,
      explanation: 'The browser packages your data into an HTTP request with headers, method, and body, then sends it over the network.'
    },
    {
      id: 'backend',
      label: 'Backend Server',
      sublabel: 'JSON / REST Call',
      color: '#ec4899',
      code: `# Django View (or Express route)
# urls.py
path('api/posts/', PostListCreateView.as_view()),

# views.py
class PostListCreateView(APIView):
    def post(self, request):
        # 1. Validate incoming data
        serializer = PostSerializer(data=request.data)
        
        if serializer.is_valid():
            # 2. Save to database
            post = serializer.save(author=request.user)
            
            # 3. Return success response
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )`,
      explanation: 'The server receives the request, routes it to the correct handler, validates the data, and prepares to interact with the database.'
    },
    {
      id: 'database',
      label: 'Database',
      sublabel: 'SQL Query',
      color: '#f43f5e',
      code: `-- What the ORM generates behind the scenes:

-- INSERT new post
INSERT INTO posts_post 
  (title, content, author_id, created_at, updated_at)
VALUES 
  ('My Post', 'Hello!', 1, NOW(), NOW())
RETURNING id, title, content, author_id, created_at;

-- The database stores the row and returns:
-- id: 42
-- title: 'My Post'
-- content: 'Hello!'
-- author_id: 1
-- created_at: '2025-02-05T10:30:00Z'`,
      explanation: 'The database executes the SQL query, stores the data permanently, and returns the newly created record with its generated ID.'
    },
    {
      id: 'db-response',
      label: 'Database Response',
      sublabel: 'Data Rows',
      color: '#f97316',
      code: `# Database returns the saved record to Django ORM

# The ORM converts it back to a Python object:
post = Post(
    id=42,
    title='My Post',
    content='Hello!',
    author_id=1,
    created_at=datetime(2025, 2, 5, 10, 30, 0)
)

# Serializer converts to dictionary:
{
    'id': 42,
    'title': 'My Post',
    'content': 'Hello!',
    'author': {
        'id': 1,
        'username': 'pablo'
    },
    'created_at': '2025-02-05T10:30:00Z'
}`,
      explanation: 'The database returns the stored data. The ORM converts raw SQL results back into application objects.'
    },
    {
      id: 'backend-return',
      label: 'Backend Server',
      sublabel: 'JSON Response',
      color: '#eab308',
      code: `# Server formats and sends HTTP response

# Response object created:
Response(
    data={
        'id': 42,
        'title': 'My Post',
        'content': 'Hello!',
        'author': {'id': 1, 'username': 'pablo'},
        'created_at': '2025-02-05T10:30:00Z'
    },
    status=201
)

# Actual HTTP Response sent:
# HTTP/1.1 201 Created
# Content-Type: application/json
# 
# {"id":42,"title":"My Post","content":"Hello!"...}`,
      explanation: 'The backend packages the data as JSON, sets appropriate status codes and headers, and sends the HTTP response back.'
    },
    {
      id: 'http-response',
      label: 'HTTP Response',
      sublabel: 'Network Transit',
      color: '#84cc16',
      code: `// The response travels back through the network

// HTTP Response Structure:
// ┌─────────────────────────────────────┐
// │ Status: 201 Created                 │
// ├─────────────────────────────────────┤
// │ Headers:                            │
// │   Content-Type: application/json    │
// │   Content-Length: 142               │
// ├─────────────────────────────────────┤
// │ Body:                               │
// │   {                                 │
// │     "id": 42,                       │
// │     "title": "My Post",             │
// │     "content": "Hello!",            │
// │     "author": {...},                │
// │     "created_at": "2025-02-05..."   │
// │   }                                 │
// └─────────────────────────────────────┘`,
      explanation: 'The HTTP response containing status code, headers, and JSON body travels back through the network to the browser.'
    },
    {
      id: 'frontend-render',
      label: 'Frontend Renders',
      sublabel: 'DOM Update / UI Render',
      color: '#22c55e',
      code: `// Back in our React component...

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const response = await createPost(postData);
  
  if (response.ok) {
    // Update React state with new post
    setPosts(prevPosts => [...prevPosts, response.data]);
    
    // Clear the form
    setTitle('');
    setContent('');
    
    // Show success message
    toast.success('Post created!');
  }
};

// React re-renders, DOM updates automatically
// User sees their new post appear in the feed! ✨`,
      explanation: 'JavaScript receives the response, updates application state, and React re-renders the UI to show the new data. The cycle is complete!'
    }
  ];

  const runAnimation = () => {
    setAnimating(true);
    setAnimationStep(0);
  };

  useEffect(() => {
    if (animating && animationStep < nodes.length) {
      const timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (animationStep >= nodes.length) {
      setAnimating(false);
    }
  }, [animating, animationStep, nodes.length]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Full-Stack Data Flow
          </h1>
          <p className="text-gray-400">Click any node to see the code at that step</p>
          <button
            onClick={runAnimation}
            disabled={animating}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {animating ? 'Animating...' : '▶ Animate Flow'}
          </button>
        </div>

        {/* Flow Diagram */}
        <div className="relative mb-8 overflow-x-auto pb-4">
          <div className="flex items-center justify-start gap-2 min-w-max px-4">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {/* Node */}
                <button
                  onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  className={`
                    relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 min-w-[100px]
                    ${activeNode === node.id 
                      ? 'border-white shadow-lg shadow-white/20 scale-105' 
                      : 'border-gray-700 hover:border-gray-500'}
                    ${animationStep >= index ? 'opacity-100' : animating ? 'opacity-30' : 'opacity-100'}
                  `}
                  style={{
                    backgroundColor: activeNode === node.id ? node.color + '30' : 'transparent',
                    borderColor: activeNode === node.id ? node.color : undefined
                  }}
                >
                  {/* Pulse animation during flow */}
                  {animationStep === index && (
                    <div 
                      className="absolute inset-0 rounded-xl animate-ping opacity-30"
                      style={{ backgroundColor: node.color }}
                    />
                  )}
                  
                  {/* Node content */}
                  <div 
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-sm font-semibold text-center leading-tight">
                    {node.label}
                  </span>
                  {node.detail && (
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      {node.detail}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
                    {node.sublabel}
                  </span>
                </button>

                {/* Arrow */}
                {index < nodes.length - 1 && (
                  <div className={`flex items-center transition-opacity duration-300 ${
                    animationStep > index ? 'opacity-100' : animating ? 'opacity-30' : 'opacity-100'
                  }`}>
                    <div className="w-6 h-0.5 bg-gray-600" />
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-600" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Data format labels */}
          <div className="flex items-center justify-start gap-2 min-w-max px-4 mt-4">
            <div className="min-w-[100px]" /> {/* Spacer for first node */}
            <div className="min-w-[100px]" /> {/* Spacer for second node */}
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <span>→</span>
              <span className="bg-purple-900/50 px-2 py-0.5 rounded">HTTP Request</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-pink-400">
              <span>→</span>
              <span className="bg-pink-900/50 px-2 py-0.5 rounded">JSON/REST</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-400">
              <span>→</span>
              <span className="bg-red-900/50 px-2 py-0.5 rounded">SQL Query</span>
            </div>
            <div className="min-w-[100px]" /> {/* Spacer */}
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <span>→</span>
              <span className="bg-yellow-900/50 px-2 py-0.5 rounded">JSON Response</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <span>→</span>
              <span className="bg-green-900/50 px-2 py-0.5 rounded">DOM Update</span>
            </div>
          </div>
        </div>

        {/* Code Panel */}
        {activeNode && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {nodes.filter(n => n.id === activeNode).map(node => (
              <div key={node.id}>
                {/* Panel Header */}
                <div 
                  className="px-6 py-4 border-b border-gray-800"
                  style={{ backgroundColor: node.color + '20' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <h2 className="text-xl font-bold">{node.label}</h2>
                    <span className="text-gray-400">— {node.sublabel}</span>
                  </div>
                  <p className="mt-2 text-gray-300">{node.explanation}</p>
                </div>

                {/* Code Block */}
                <div className="p-6">
                  <pre className="bg-gray-950 rounded-xl p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300 font-mono whitespace-pre">
                      {node.code}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">The Journey of Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-indigo-400">Request Path</span>
                <p className="text-gray-400">User action → Frontend → Browser → Server → Database</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-yellow-400">Response Path</span>
                <p className="text-gray-400">Database → Server → HTTP Response → Frontend → UI Update</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-green-400">Data Formats</span>
                <p className="text-gray-400">JS Object → JSON → SQL → JSON → JS Object → DOM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Built for understanding full-stack architecture • NUMENEON style 🌊</p>
        </div>
      </div>
    </div>
  );
};

export default FullStackFlow;
