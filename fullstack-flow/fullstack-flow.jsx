import React, { useState, useEffect } from 'react';

const FullStackFlow = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  const nodes = [
    {
      id: 'user-click',
      label: 'User Click',
      sublabel: 'UI Event',
      color: '#6366f1',
      files: [
        { name: 'ComposerModal.jsx', path: 'components/pages/Profile/components/ComposerModal/' },
        { name: 'Home.jsx', path: 'components/pages/Home/' }
      ],
      code: `// NUMENEON: User clicks post button in ComposerModal.jsx or Home.jsx
// Located in: components/pages/Profile/components/ComposerModal/ComposerModal.jsx

// The inline composer in Home.jsx
<div className="inline-composer-wrapper">
  <textarea
    value={composerText}
    onChange={(e) => setComposerText(e.target.value)}
    onKeyDown={handleInlineKeyDown} // Cmd+Enter to post
    placeholder="What's on your mind?"
  />
  <button onClick={handleInlinePost}>Post</button>
</div>

// Or the modal composer with full features
<ComposerModal
  showComposer={showComposer}
  setShowComposer={setShowComposer}
  composerType={composerType}  // 'thought', 'media', 'milestone'
/>`,
      explanation: 'The journey begins when a user interacts with the UI. In NUMENEON, users can post from the inline composer on the Home page, or open ComposerModal for the full experience with media uploads and post types.',
      connections: '→ User action triggers React event handler → leads to usePosts() hook methods'
    },
    {
      id: 'frontend',
      label: 'Frontend',
      sublabel: 'JS Execution',
      detail: 'React + Hooks',
      color: '#8b5cf6',
      files: [
        { name: 'Home.jsx', path: 'components/pages/Home/' },
        { name: 'PostsContext.jsx', path: 'contexts/' },
        { name: 'usePosts()', path: 'contexts/PostsContext.jsx (exported hook)' }
      ],
      code: `// NUMENEON: Home.jsx uses the usePosts() hook from PostsContext
// The hook is defined at the bottom of PostsContext.jsx

// Step 1: Import the hook (from barrel export in contexts/index.js)
import { usePosts, useAuth } from '@contexts';

// Step 2: Destructure what you need from the hook
const { posts, createPost, deletePost, updatePost } = usePosts();
// ↑ These all come from PostsContext.Provider's value prop

// Step 3: Call createPost when user submits
const handleInlinePost = async () => {
  if (!composerText.trim() || isPosting) return;
  
  setIsPosting(true);
  // createPost comes from usePosts() → PostsContext → postsService
  const result = await createPost({ 
    content: composerText.trim(), 
    type: 'thoughts' 
  });
  setIsPosting(false);
  
  if (result.success) {
    setComposerText(''); // Clear input on success
  } else {
    alert(result.error || 'Failed to create post');
  }
};`,
      explanation: 'The React component uses the usePosts() custom hook to access global posts state and actions. This hook is exported from PostsContext.jsx and consumes PostsContext. The createPost action calls postsService under the hood.',
      connections: 'usePosts() hook → PostsContext.Provider → createPost function → postsService.create()'
    },
    {
      id: 'context-layer',
      label: 'Context Layer',
      sublabel: 'State Management',
      detail: 'React Context',
      color: '#d946ef',
      files: [
        { name: 'PostsContext.jsx', path: 'contexts/' },
        { name: 'main.jsx', path: 'src/' },
        { name: 'index.js', path: 'contexts/ (barrel export)' }
      ],
      code: `// NUMENEON CONTEXT LAYER
// PostsContext.jsx - Global state + actions for posts

// 1. Create the context (empty container)
const PostsContext = createContext(null);

// 2. Provider component wraps the app (in main.jsx)
export const PostsProvider = ({ children }) => {
  // STATE - the "source of truth"
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ACTION - createPost calls the service layer
  const createPost = async (postData) => {
    try {
      const newPost = await postsService.create(postData);
      // ↑ This is where Context calls Service!
      
      // Update state - triggers re-render for all consumers
      setPosts(prev => [newPost, ...prev]);
      
      return { success: true, post: newPost };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Expose state + actions to children
  return (
    <PostsContext.Provider value={{ 
      posts, isLoading, error,
      createPost, updatePost, deletePost, likePost 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

// 3. Custom hook for clean consumption
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be in PostsProvider');
  return context;
};`,
      explanation: 'The Context Layer is the bridge between components and services. PostsContext holds the global posts state (posts array) and provides action functions (createPost, updatePost, etc.) that call the service layer. When state updates, all consuming components re-render automatically.',
      connections: 'Component calls usePosts() → gets createPost from Context → Context calls postsService.create() → updates state with setPosts()'
    },
    {
      id: 'browser',
      label: 'Service Layer',
      sublabel: 'API Call',
      color: '#a855f7',
      files: [
        { name: 'postsService.js', path: 'services/' },
        { name: 'apiClient.js', path: 'services/' }
      ],
      code: `// NUMENEON SERVICE LAYER
// postsService.js is an OBJECT with async methods
// It uses apiClient (axios instance) for HTTP calls

// services/postsService.js
import apiClient from "./apiClient"; // Axios with JWT interceptors

const postsService = {
  // POST /api/posts/ → create post
  create: async (data) => {
    // data = { content: "text", type: "thoughts" }
    const response = await apiClient.post("/posts/", data);
    return response.data;
    // Returns new post with id, author, timestamps
  },
  
  getAll: async () => {
    const response = await apiClient.get("/posts/");
    return response.data;
  },
  // ... other CRUD methods
};

// services/apiClient.js - The foundation
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Auto-detects dev vs prod
  headers: { "Content-Type": "application/json" }
});

// Request interceptor adds JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});`,
      explanation: 'The service layer abstracts API calls. postsService.js is a plain object (not a class) with async methods. It uses apiClient.js (axios instance) which automatically handles auth tokens via interceptors. This separation keeps components clean.',
      connections: 'PostsContext.createPost() → postsService.create(data) → apiClient.post() → axios HTTP request'
    },
    {
      id: 'backend',
      label: 'Backend Server',
      sublabel: 'Django REST',
      color: '#ec4899',
      files: [
        { name: 'urls.py', path: 'backend/posts/' },
        { name: 'views.py', path: 'backend/posts/' },
        { name: 'serializers.py', path: 'backend/posts/' }
      ],
      code: `# DJANGO BACKEND (numeneon-backend repository)
# The API endpoint that receives the request

# posts/urls.py - URL routing
urlpatterns = [
    path('', PostListCreateView.as_view()),     # GET list, POST create
    path('<int:pk>/', PostDetailView.as_view()), # GET, PATCH, DELETE single
    path('<int:pk>/like/', PostLikeView.as_view()),
    path('<int:pk>/replies/', PostRepliesView.as_view()),
]

# posts/views.py - Request handler
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Automatically set author to logged-in user
        serializer.save(author=self.request.user)

# posts/serializers.py - Data validation & transformation
class PostSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'type', 'author', 'created_at', 
                  'likes_count', 'is_liked', 'reply_count']`,
      explanation: 'Django REST Framework handles the request. urls.py routes to the correct view, the view validates data using serializers, and performs the database operation. The serializer defines what fields are accepted/returned.',
      connections: 'HTTP POST /api/posts/ → urls.py routing → PostListCreateView.post() → PostSerializer validation → Model.save()'
    },
    {
      id: 'database',
      label: 'Database',
      sublabel: 'PostgreSQL',
      color: '#f43f5e',
      files: [
        { name: 'models.py', path: 'backend/posts/' },
        { name: 'migrations/', path: 'backend/posts/migrations/' }
      ],
      code: `# DJANGO ORM → SQL
# models.py defines the Post model

# posts/models.py
class Post(models.Model):
    TYPE_CHOICES = [
        ('thoughts', 'Thoughts'),
        ('media', 'Media'),
        ('milestones', 'Milestones'),
    ]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    media_url = models.URLField(blank=True)
    parent = models.ForeignKey('self', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
# What Django ORM generates:
INSERT INTO posts_post 
  (content, type, author_id, created_at, updated_at)
VALUES 
  ('Hello world!', 'thoughts', 1, NOW(), NOW())
RETURNING id, content, type, author_id, created_at;

-- PostgreSQL stores the row and returns:
-- id: 42, content: 'Hello world!', type: 'thoughts'`,
      explanation: 'Django ORM translates Python model operations into SQL. The Post model defines the schema with fields like author (foreign key), content, type, and timestamps. migrations/ contains the SQL schema changes.',
      connections: 'serializer.save() → Post.objects.create() → Django ORM → INSERT INTO posts_post'
    },
    {
      id: 'db-response',
      label: 'DB Response',
      sublabel: 'Data Rows',
      color: '#f97316',
      files: [
        { name: 'models.py', path: 'backend/posts/' },
        { name: 'serializers.py', path: 'backend/posts/' }
      ],
      code: `# Database returns the saved record to Django

# 1. PostgreSQL returns the inserted row
# → Django ORM converts to Post instance:
post = Post(
    id=42,
    content='Hello world!',
    type='thoughts',
    author_id=1,
    created_at=datetime(2025, 2, 12, 10, 30, 0)
)

# 2. Serializer transforms for JSON response
# PostSerializer.to_representation() runs:
{
    'id': 42,
    'content': 'Hello world!',
    'type': 'thoughts',
    'author': {
        'id': 1,
        'username': 'pablo',
        'display_name': 'Pablo',
        'avatar_url': 'https://...'
    },
    'created_at': '2025-02-12T10:30:00Z',
    'likes_count': 0,
    'is_liked': False,
    'reply_count': 0
}`,
      explanation: 'PostgreSQL returns the newly created row. Django ORM hydrates it into a Post model instance. The serializer then transforms it into a JSON-friendly dictionary, expanding foreign keys (like author) into nested objects.',
      connections: 'PostgreSQL row → Django Post instance → PostSerializer.data → JSON dictionary'
    },
    {
      id: 'backend-return',
      label: 'Backend Server',
      sublabel: 'JSON Response',
      color: '#eab308',
      files: [
        { name: 'views.py', path: 'backend/posts/' }
      ],
      code: `# Django REST Framework creates the HTTP response

# In views.py after serializer.save():
class PostListCreateView(generics.ListCreateAPIView):
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # DRF automatically returns Response with 201
        return Response(
            serializer.data,  # The JSON dictionary
            status=status.HTTP_201_CREATED
        )

# Actual HTTP Response sent over the network:
# ┌────────────────────────────────────────┐
# │ HTTP/1.1 201 Created                   │
# │ Content-Type: application/json         │
# │ Access-Control-Allow-Origin: *         │
# ├────────────────────────────────────────┤
# │ {                                      │
# │   "id": 42,                            │
# │   "content": "Hello world!",           │
# │   "type": "thoughts",                  │
# │   "author": {"id": 1, ...},            │
# │   "created_at": "2025-02-12T10:30:00Z" │
# │ }                                      │
# └────────────────────────────────────────┘`,
      explanation: 'Django REST Framework creates an HTTP Response with status 201 Created. The serializer data becomes the JSON body. CORS headers allow the frontend (different origin) to read the response.',
      connections: 'Response(serializer.data, status=201) → HTTP Response → Back through network to browser'
    },
    {
      id: 'http-response',
      label: 'API Client',
      sublabel: 'Response Handling',
      color: '#84cc16',
      files: [
        { name: 'apiClient.js', path: 'services/' },
        { name: 'postsService.js', path: 'services/' }
      ],
      code: `// NUMENEON: Response flows back through service layer

// 1. apiClient.js response interceptor (handles 401 refresh)
apiClient.interceptors.response.use(
  (response) => response, // Success: pass through
  async (error) => {
    // If 401 Unauthorized, try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { access } = await refreshToken();
      localStorage.setItem("accessToken", access);
      return apiClient(originalRequest); // Retry with new token
    }
    return Promise.reject(error);
  }
);

// 2. postsService.js extracts the data
const postsService = {
  create: async (data) => {
    const response = await apiClient.post("/posts/", data);
    return response.data; // Just the JSON, not full axios response
    // Returns: { id: 42, content: "Hello!", author: {...} }
  },
};

// 3. Axios response structure:
// response.status = 201
// response.data = { id: 42, content: "Hello!", ... }
// response.headers = { "content-type": "application/json" }`,
      explanation: 'The response flows back through axios. The response interceptor can handle 401s by refreshing tokens automatically. postsService extracts response.data (the JSON body) and returns it to the calling context.',
      connections: 'HTTP Response → axios interceptors → postsService returns response.data → PostsContext receives new post'
    },
    {
      id: 'frontend-render',
      label: 'Frontend Renders',
      sublabel: 'React State Update',
      color: '#22c55e',
      files: [
        { name: 'PostsContext.jsx', path: 'contexts/' },
        { name: 'Home.jsx', path: 'components/pages/Home/' },
        { name: 'TimelineRiverFeed.jsx', path: 'components/pages/Home/components/' }
      ],
      code: `// NUMENEON: PostsContext updates state, React re-renders

// PostsContext.jsx - createPost action
const createPost = async (postData) => {
  try {
    const newPost = await postsService.create(postData);
    
    // Update posts state - new post at top of array
    setPosts(prev => [newPost, ...prev]);
    
    // Auto-expand the category that was just posted to
    if (postData.type) {
      expandDeck(postData.type);
    }
    
    return { success: true, post: newPost };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.detail || 'Failed to create post' 
    };
  }
};

// Back in Home.jsx, the component re-renders automatically!
// Because it destructured 'posts' from usePosts():
const { posts, createPost } = usePosts();

// The new post appears in TimelineRiverFeed:
<TimelineRiverFeed 
  posts={posts}  // ← Updated array with new post at index 0
  onDelete={deletePost}
  onUpdate={updatePost}
/>

// React sees state changed → Virtual DOM diff → DOM update
// User sees their new post appear at the top! ✨`,
      explanation: 'PostsContext receives the new post and updates the posts array via setPosts(). All components using usePosts() automatically re-render because React detects the state change. The cycle is complete!',
      connections: 'postsService.create() returns → PostsContext.setPosts() → React state update → All usePosts() consumers re-render'
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
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={runAnimation}
              disabled={animating}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {animating ? 'Animating...' : '▶ Animate Flow'}
            </button>
            <button
              onClick={() => setIsZoomedOut(!isZoomedOut)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {isZoomedOut ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Zoom In
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                  Zoom Out
                </>
              )}
            </button>
          </div>
        </div>

        {/* Flow Diagram - Zoomed Out (Diagram View) */}
        {isZoomedOut ? (
          <div className="relative mb-8 bg-gray-900/30 rounded-2xl border border-gray-800 p-8 overflow-hidden">
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                </marker>
                <linearGradient id="requestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient id="responseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              
              {/* Request path - top arc */}
              <path 
                d="M 100 180 Q 400 20 700 180" 
                stroke="url(#requestGradient)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="8 4"
                opacity="0.6"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Response path - bottom arc */}
              <path 
                d="M 700 220 Q 400 380 100 220" 
                stroke="url(#responseGradient)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="8 4"
                opacity="0.6"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Labels */}
              <text x="400" y="60" textAnchor="middle" fill="#6366f1" fontSize="12" fontWeight="500">
                REQUEST →
              </text>
              <text x="400" y="350" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="500">
                ← RESPONSE
              </text>
            </svg>
            
            {/* Nodes Grid - positioned for diagram view */}
            <div className="relative grid grid-cols-5 gap-4 min-h-[300px]" style={{ zIndex: 1 }}>
              {/* Top Row - Request Path */}
              <div className="flex flex-col items-center justify-start pt-4">
                {/* User Click */}
                <DiagramNode 
                  node={nodes[0]} 
                  isActive={activeNode === nodes[0].id}
                  animationStep={animationStep}
                  index={0}
                  onClick={() => setActiveNode(activeNode === nodes[0].id ? null : nodes[0].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-start pt-8">
                {/* Frontend */}
                <DiagramNode 
                  node={nodes[1]} 
                  isActive={activeNode === nodes[1].id}
                  animationStep={animationStep}
                  index={1}
                  onClick={() => setActiveNode(activeNode === nodes[1].id ? null : nodes[1].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-start pt-4">
                {/* Context Layer */}
                <DiagramNode 
                  node={nodes[2]} 
                  isActive={activeNode === nodes[2].id}
                  animationStep={animationStep}
                  index={2}
                  onClick={() => setActiveNode(activeNode === nodes[2].id ? null : nodes[2].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-start pt-8">
                {/* Service Layer */}
                <DiagramNode 
                  node={nodes[3]} 
                  isActive={activeNode === nodes[3].id}
                  animationStep={animationStep}
                  index={3}
                  onClick={() => setActiveNode(activeNode === nodes[3].id ? null : nodes[3].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                {/* Backend */}
                <DiagramNode 
                  node={nodes[4]} 
                  isActive={activeNode === nodes[4].id}
                  animationStep={animationStep}
                  index={4}
                  onClick={() => setActiveNode(activeNode === nodes[4].id ? null : nodes[4].id)}
                />
              </div>
              
              {/* Middle - Database */}
              <div className="col-span-5 flex justify-center">
                <DiagramNode 
                  node={nodes[5]} 
                  isActive={activeNode === nodes[5].id}
                  animationStep={animationStep}
                  index={5}
                  onClick={() => setActiveNode(activeNode === nodes[5].id ? null : nodes[5].id)}
                  large
                />
              </div>
              
              {/* Bottom Row - Response Path */}
              <div className="flex flex-col items-center justify-end pb-4">
                {/* Frontend Renders */}
                <DiagramNode 
                  node={nodes[9]} 
                  isActive={activeNode === nodes[9].id}
                  animationStep={animationStep}
                  index={9}
                  onClick={() => setActiveNode(activeNode === nodes[9].id ? null : nodes[9].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-end pb-8">
                {/* API Client */}
                <DiagramNode 
                  node={nodes[8]} 
                  isActive={activeNode === nodes[8].id}
                  animationStep={animationStep}
                  index={8}
                  onClick={() => setActiveNode(activeNode === nodes[8].id ? null : nodes[8].id)}
                />
              </div>
              <div className="col-span-1" /> {/* Spacer */}
              <div className="flex flex-col items-center justify-end pb-8">
                {/* Backend Return */}
                <DiagramNode 
                  node={nodes[7]} 
                  isActive={activeNode === nodes[7].id}
                  animationStep={animationStep}
                  index={7}
                  onClick={() => setActiveNode(activeNode === nodes[7].id ? null : nodes[7].id)}
                />
              </div>
              <div className="flex flex-col items-center justify-end pb-4">
                {/* DB Response */}
                <DiagramNode 
                  node={nodes[6]} 
                  isActive={activeNode === nodes[6].id}
                  animationStep={animationStep}
                  index={6}
                  onClick={() => setActiveNode(activeNode === nodes[6].id ? null : nodes[6].id)}
                />
              </div>
            </div>
            
            {/* Legend for diagram view */}
            <div className="mt-4 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-rose-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-gray-400">Request Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-green-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-gray-400">Response Path</span>
              </div>
            </div>
          </div>
        ) : (
          /* Flow Diagram - Zoomed In (Train View) */
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
              <div className="min-w-[100px]" /> {/* Spacer for context node */}
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
        )}

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
                  
                  {/* Connection Flow */}
                  {node.connections && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-gray-500">Flow:</span>
                      <span 
                        className="px-3 py-1 rounded-full font-mono"
                        style={{ backgroundColor: node.color + '30', color: node.color }}
                      >
                        {node.connections}
                      </span>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                {node.files && node.files.length > 0 && (
                  <div className="px-6 py-3 border-b border-gray-800 bg-gray-950/50">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-400">Files Involved</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.files.map((file, i) => (
                        <div 
                          key={i}
                          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-default"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-mono text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500 hidden group-hover:inline">
                            {file.path}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
          <h3 className="text-lg font-semibold mb-4">The Journey of Data in NUMENEON</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-indigo-400">Component Layer</span>
                <p className="text-gray-400">Home.jsx, Profile.jsx → uses usePosts() hook</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-purple-400">Context Layer</span>
                <p className="text-gray-400">PostsContext.jsx → manages state, calls services</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-pink-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-pink-400">Service Layer</span>
                <p className="text-gray-400">postsService.js → uses apiClient for HTTP</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-green-400">API Client</span>
                <p className="text-gray-400">apiClient.js → axios with JWT interceptors</p>
              </div>
            </div>
          </div>
          
          {/* Provider Hierarchy */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Provider Hierarchy (main.jsx)</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-indigo-900/50 text-indigo-400">AuthProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-purple-900/50 text-purple-400">WebSocketProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-pink-900/50 text-pink-400">NotificationProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-rose-900/50 text-rose-400">PostsProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-orange-900/50 text-orange-400">StoriesProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-yellow-900/50 text-yellow-400">FriendsProvider</span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 rounded bg-green-900/50 text-green-400">App</span>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Built for understanding full-stack architecture • NUMENEON, IE</p>
        </div>
      </div>
    </div>
  );
};

// Diagram Node component for zoomed-out view
const DiagramNode = ({ node, isActive, animationStep, index, onClick, large }) => (
  <button
    onClick={onClick}
    className={`
      relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-300
      ${large ? 'min-w-[120px]' : 'min-w-[90px]'}
      ${isActive 
        ? 'border-white shadow-lg shadow-white/20 scale-110 z-10' 
        : 'border-gray-700 hover:border-gray-500 hover:scale-105'}
      ${animationStep >= index ? 'opacity-100' : 'opacity-50'}
    `}
    style={{
      backgroundColor: isActive ? node.color + '40' : node.color + '15',
      borderColor: isActive ? node.color : undefined
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
      className={`rounded-full mb-1 ${large ? 'w-4 h-4' : 'w-3 h-3'}`}
      style={{ backgroundColor: node.color }}
    />
    <span className={`font-semibold text-center leading-tight ${large ? 'text-sm' : 'text-xs'}`}>
      {node.label}
    </span>
    <span className="text-[9px] text-gray-400 mt-0.5">
      {node.sublabel}
    </span>
  </button>
);

export default FullStackFlow;
