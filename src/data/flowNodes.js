/**
 * Flow nodes data representing each step in the full-stack data flow
 * Using Numeneon social app as a real-world example
 * Each node contains information about a specific stage in the request/response cycle
 */

export const flowNodes = [
  {
    id: "user-click",
    label: "User Click",
    sublabel: "UI Event",
    color: "#6366f1",
    files: [
      {
        path: "src/components/pages/Home/Home.jsx",
        name: "Home.jsx",
        description:
          "The Home page component where users see their timeline feed. Contains the inline composer input and button that triggers the post creation flow.",
        imports: ["usePosts", "useState", "ComposerModal"],
        usedBy: ["App.jsx (via Router)"],
        connectsTo:
          "When user types in the composer and clicks post, it calls createPost() from usePosts context hook.",
        keyFunction: `// The click handler that starts the entire flow
const handleInlinePost = async () => {
  if (!composerText.trim()) return;
  setIsPosting(true);
  
  const result = await createPost({ 
    content: composerText.trim(), 
    type: 'thoughts' 
  });
  
  if (result.success) setComposerText('');
  setIsPosting(false);
};`,
      },
      {
        path: "src/components/pages/Profile/components/ComposerModal/ComposerModal.jsx",
        name: "ComposerModal.jsx",
        description:
          "Modal dialog for composing longer posts with type selection (thoughts, media, milestones). The modal's submit button triggers the same createPost flow.",
        imports: ["usePosts", "useAuth", "useState"],
        usedBy: ["Home.jsx", "Profile.jsx"],
        connectsTo:
          "Uses usePosts() hook to call createPost() with {content, type} data when user submits.",
        keyFunction: `// Modal submit handler with type selection
const handleSubmit = async () => {
  const { createPost } = usePosts();
  
  await createPost({
    content: composerText,
    type: selectedType, // 'thoughts' | 'media' | 'milestones'
    media: uploadedMedia
  });
  
  onClose();
};`,
      },
    ],
    code: `// Home.jsx - User clicks post button
const { createPost } = usePosts(); // Get from context

const handleInlinePost = async () => {
  if (!composerText.trim()) return;
  
  setIsPosting(true);
  // This calls createPost from PostsContext
  const result = await createPost({ 
    content: composerText.trim(), 
    type: 'thoughts' 
  });
  setIsPosting(false);
  
  if (result.success) {
    setComposerText(''); // Clear input
  }
};`,
    explanation:
      "The journey begins when a user interacts with the UI—clicking a button, submitting a form, or triggering any event. In Numeneon, this happens in Home.jsx or ComposerModal.jsx.",
  },
  {
    id: "frontend",
    label: "Frontend",
    sublabel: "JS Execution",
    detail: "HTML/CSS/JavaScript",
    color: "#8b5cf6",
    files: [
      {
        path: "src/contexts/PostsContext.jsx",
        name: "PostsContext.jsx",
        description:
          "React Context that provides global posts state to the entire app. Contains posts array, loading state, and CRUD functions (createPost, updatePost, deletePost).",
        imports: ["postsService", "useAuth", "createContext"],
        usedBy: ["Home.jsx", "Profile.jsx", "Feed.jsx", "PostCard.jsx"],
        connectsTo:
          "createPost() calls postsService.create() and then updates local state with setPosts(). The service layer handles the actual HTTP request.",
        keyFunction: `// The core createPost function from context
const createPost = async (postData) => {
  try {
    const newPost = await postsService.create(postData);
    setPosts(prev => [newPost, ...prev]); // Prepend
    expandDeck(postData.type);
    return { success: true, post: newPost };
  } catch (err) {
    return { success: false, error: err.message };
  }
};`,
      },
      {
        path: "src/contexts/index.js",
        name: "index.js (Barrel Export)",
        description:
          "Barrel file that re-exports all contexts and their hooks. Components import { usePosts } from '@contexts' instead of the full path.",
        imports: ["All context files"],
        usedBy: ["All components that need context"],
        connectsTo:
          "Central hub that makes importing contexts clean: export { PostsProvider, usePosts } from './PostsContext'",
        keyFunction: `// Clean barrel exports for all contexts
export { PostsProvider, usePosts } from './PostsContext';
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { NotificationProvider } from './NotificationContext';`,
      },
    ],
    code: `// PostsContext.jsx - The createPost function
const createPost = async (postData) => {
  try {
    // Call the service layer
    const newPost = await postsService.create(postData);
    
    // Update React state (adds to top of feed)
    setPosts(prev => [newPost, ...prev]);
    
    // Auto-expand the category deck
    expandDeck(postData.type);
    
    return { success: true, post: newPost };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || 'Failed'
    };
  }
};`,
    explanation:
      "JavaScript captures the event, gathers form data, validates it client-side, and prepares to send it to the server. PostsContext is the bridge between UI and API.",
  },
  {
    id: "browser",
    label: "Browser",
    sublabel: "Request Creation",
    color: "#a855f7",
    files: [
      {
        path: "src/services/apiClient.js",
        name: "apiClient.js",
        description:
          "Base Axios instance with interceptors that automatically attach JWT tokens to every request and handle token refresh on 401 errors.",
        imports: ["axios"],
        usedBy: ["postsService", "authService", "usersService", "all services"],
        connectsTo:
          "Every service imports this client. Request interceptor adds 'Authorization: Bearer {token}' header. Response interceptor handles 401 → refresh token → retry.",
        keyFunction: `// Auto-attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});`,
      },
      {
        path: "src/services/postsService.js",
        name: "postsService.js",
        description:
          "Service object containing all posts-related API functions: getAll(), create(), update(), delete(), like(), share(). Each function uses apiClient.",
        imports: ["apiClient"],
        usedBy: ["PostsContext.jsx"],
        connectsTo:
          "postsService.create(data) calls apiClient.post('/posts/', data). apiClient handles auth headers automatically.",
        keyFunction: `// Posts service - API abstraction layer
const postsService = {
  create: async (data) => {
    const response = await apiClient.post('/posts/', data);
    return response.data;
  },
  getAll: () => apiClient.get('/posts/'),
  like: (id) => apiClient.post(\`/posts/\${id}/like/\`),
};`,
      },
    ],
    code: `// postsService.js - Makes the actual HTTP call
import apiClient from "./apiClient";

const postsService = {
  create: async (data) => {
    // data = { content: "Hello!", type: "thoughts" }
    const response = await apiClient.post("/posts/", data);
    return response.data;
  },
  // ... other methods
};

// apiClient.js - Adds auth header automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// What actually gets sent over the network:
// POST /api/posts/ HTTP/1.1
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// Content-Type: application/json
// {"content":"Hello!","type":"thoughts"}`,
    explanation:
      "The browser packages your data into an HTTP request with headers, method, and body, then sends it over the network. apiClient handles auth automatically.",
  },
  {
    id: "backend",
    label: "Backend Server",
    sublabel: "JSON / REST Call",
    color: "#ec4899",
    files: [
      {
        path: "backend/posts/urls.py",
        name: "urls.py",
        description:
          "URL routing configuration that maps /api/posts/ to the PostViewSet. Uses DRF's router.register() for automatic CRUD route generation.",
        imports: ["PostViewSet", "DefaultRouter"],
        usedBy: ["Django's main urls.py includes this"],
        connectsTo:
          "When request hits /api/posts/, Django routes to PostViewSet.create() for POST requests. Router auto-generates: list, create, retrieve, update, destroy.",
        keyFunction: `# DRF Router auto-generates all CRUD URLs
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
# Creates: GET/POST /posts/, GET/PUT/DELETE /posts/{id}/`,
      },
      {
        path: "backend/posts/views.py",
        name: "views.py",
        description:
          "Django REST Framework ViewSet handling all posts CRUD operations. Uses serializer for validation and permission classes for auth.",
        imports: ["PostSerializer", "IsAuthenticated", "Post model"],
        usedBy: ["urls.py routes to this"],
        connectsTo:
          "ViewSet's create() validates via PostSerializer → serializer.save(author=request.user) → calls model's save() → returns Response with serializer.data",
        keyFunction: `# ViewSet create method - handles POST /posts/
class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)  # Auto-attach user
        return Response(serializer.data, status=201)`,
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "Converts between JSON ↔ Python and validates data. Defines which fields are read_only (id, created_at) vs writable (content, type).",
        imports: ["Post model", "serializers.ModelSerializer"],
        usedBy: ["views.py"],
        connectsTo:
          "serializer.is_valid() checks required fields, types. serializer.save() creates Post instance. serializer.data converts back to JSON dict.",
        keyFunction: `# Serializer defines shape of JSON ↔ Python
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'type', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']`,
      },
    ],
    code: `# Django REST Framework - Numeneon Backend

# urls.py - Route registration
router.register(r'posts', PostViewSet, basename='posts')
# Creates: GET /api/posts/, POST /api/posts/, 
#          GET/PUT/DELETE /api/posts/{id}/

# views.py - The ViewSet
class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # author=request.user attaches logged-in user
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)

# serializers.py - Validation & transformation
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'type', 'author', 
                  'created_at', 'likes_count']
        read_only_fields = ['id', 'author', 'created_at']`,
    explanation:
      "The server receives the request, routes it to the correct handler, validates the data, and prepares to interact with the database. DRF ViewSets handle CRUD automatically.",
  },
  {
    id: "database",
    label: "Database",
    sublabel: "SQL Query",
    color: "#f43f5e",
    files: [
      {
        path: "backend/posts/models.py",
        name: "models.py",
        description:
          "Django model defining the Post table schema. Fields include content, type, author (ForeignKey to User), parent (self-referential for replies), likes_count, etc.",
        imports: ["django.db.models", "User model"],
        usedBy: ["serializers.py", "views.py"],
        connectsTo:
          "serializer.save() calls Post.objects.create() which generates INSERT SQL. ForeignKey to User creates author_id column with index.",
        keyFunction: `# Django Model → Database Table Schema
class Post(models.Model):
    TYPE_CHOICES = [
        ('thoughts', 'Thoughts'),
        ('media', 'Media'),
        ('milestones', 'Milestones'),
    ]
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)`,
      },
      {
        path: "backend/posts/migrations/0001_initial.py",
        name: "0001_initial.py",
        description:
          "Auto-generated migration that creates posts_post table in PostgreSQL. Run with 'python manage.py migrate'.",
        imports: ["migrations.Migration"],
        usedBy: ["Django migration system"],
        connectsTo:
          "Creates table with columns matching model fields. ForeignKey creates author_id with FK constraint to auth_user table.",
        keyFunction: `# Migration creates the actual SQL table
class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('content', models.TextField()),
                ('type', models.CharField(max_length=20)),
                ('author', models.ForeignKey('auth.User')),
            ],
        ),
    ]`,
      },
    ],
    code: `# models.py - Post model definition
class Post(models.Model):
    TYPE_CHOICES = [
        ('thoughts', 'Thoughts'),
        ('media', 'Media'),
        ('milestones', 'Milestones'),
    ]
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True)  # For replies
    created_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)

-- What Django ORM generates:
INSERT INTO posts_post 
  (content, type, author_id, parent_id, created_at, likes_count)
VALUES 
  ('Hello!', 'thoughts', 1, NULL, NOW(), 0)
RETURNING id, content, type, author_id, created_at...`,
    explanation:
      "The database executes the SQL query, stores the data permanently, and returns the newly created record with its generated ID. Django ORM translates Python to SQL.",
  },
  {
    id: "db-response",
    label: "Database Response",
    sublabel: "Data Rows",
    color: "#f97316",
    files: [
      {
        path: "backend/posts/models.py",
        name: "models.py",
        description:
          "The ORM hydrates the returned row data into a Post model instance. Django converts SQL row back to Python object with all field values populated.",
        imports: ["django.db.models"],
        usedBy: ["serializers.py for conversion"],
        connectsTo:
          "Post.objects.create() returns a Post instance. The instance has all fields accessible as attributes: post.id, post.content, post.author, etc.",
        keyFunction: `# ORM hydrates SQL row → Python object
post = Post.objects.create(
    content='Hello!',
    type='thoughts',
    author=request.user
)
# post.id is now auto-generated (42)
# post.created_at is auto-set to NOW()`,
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "Serializer converts the Post model instance into a Python dictionary. It also fetches nested data like author info via related serializers.",
        imports: ["Post model", "UserSerializer"],
        usedBy: ["views.py passes this to Response()"],
        connectsTo:
          "PostSerializer(post) gives serializer.data dict. Nested UserSerializer converts author FK to {id, username, profile_picture}.",
        keyFunction: `# Serializer converts Model → JSON-ready dict
serializer = PostSerializer(post)
serializer.data  # Returns:
{
    'id': 42,
    'content': 'Hello!',
    'author': {'id': 1, 'username': 'pablo'}
}`,
      },
    ],
    code: `# Database returns saved row → ORM creates Post instance

# The ORM hydrates a Python object:
post = Post(
    id=42,
    content='Hello!',
    type='thoughts',
    author_id=1,  # FK reference
    created_at=datetime(2025, 2, 5, 10, 30, 0),
    likes_count=0
)

# Serializer expands relationships & formats:
serializer = PostSerializer(post)
serializer.data  # Returns:
{
    'id': 42,
    'content': 'Hello!',
    'type': 'thoughts',
    'author': {  # Nested from UserSerializer
        'id': 1,
        'username': 'pablo',
        'profile_picture': '/media/avatars/pablo.jpg'
    },
    'created_at': '2025-02-05T10:30:00Z',
    'likes_count': 0
}`,
    explanation:
      "The database returns the stored data. The ORM converts raw SQL results back into application objects. Serializers expand relationships into nested data.",
  },
  {
    id: "backend-return",
    label: "Backend Server",
    sublabel: "JSON Response",
    color: "#eab308",
    files: [
      {
        path: "backend/posts/views.py",
        name: "views.py",
        description:
          "View returns a Response object with serializer.data and HTTP 201 status. DRF handles JSON encoding automatically.",
        imports: ["Response", "status"],
        usedBy: ["Django's HTTP response system"],
        connectsTo:
          "return Response(serializer.data, status=201) → DRF converts dict to JSON string → sets Content-Type header → sends to client.",
        keyFunction: `# Return DRF Response with status code
return Response(
    serializer.data,
    status=status.HTTP_201_CREATED
)
# DRF auto-converts dict → JSON string
# Sets Content-Type: application/json`,
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "serializer.data property provides the final JSON-ready dictionary with all nested author data expanded.",
        imports: ["Post model", "UserSerializer"],
        usedBy: ["views.py reads serializer.data"],
        connectsTo:
          "The dict goes to Response() → json.dumps() converts to string → becomes HTTP response body.",
        keyFunction: `# .data property gives JSON-ready dict
serializer.data
# {"id":42,"content":"Hello!","type":"thoughts",
#  "author":{"id":1,"username":"pablo"}}`,
      },
    ],
    code: `# views.py - Final step before sending response
class PostViewSet(viewsets.ModelViewSet):
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        
        # Return Response with serializer.data
        return Response(
            serializer.data,  # The Python dict
            status=status.HTTP_201_CREATED
        )

# DRF converts to HTTP response:
# HTTP/1.1 201 Created
# Content-Type: application/json
# Access-Control-Allow-Origin: *
# 
# {"id":42,"content":"Hello!","type":"thoughts",
#  "author":{"id":1,"username":"pablo"}...}`,
    explanation:
      "The backend packages the data as JSON, sets appropriate status codes and headers, and sends the HTTP response back. DRF handles serialization automatically.",
  },
  {
    id: "http-response",
    label: "HTTP Response",
    sublabel: "Network Transit",
    color: "#84cc16",
    files: [
      {
        path: "src/services/apiClient.js",
        name: "apiClient.js",
        description:
          "Axios instance receives the response. Response interceptor checks status. If 401, it attempts token refresh before returning error.",
        imports: ["axios"],
        usedBy: ["postsService awaits this"],
        connectsTo:
          "Response interceptor handles 401 → attempts refresh with refreshToken → retries original request with new accessToken. Success/fail propagates to service layer.",
        keyFunction: `// Response interceptor handles auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return apiClient.request(error.config); // Retry
    }
    return Promise.reject(error);
  }
);`,
      },
      {
        path: "src/services/postsService.js",
        name: "postsService.js",
        description:
          "Service function awaits apiClient.post(). Axios auto-parses JSON. Returns response.data (the post object) to PostsContext.",
        imports: ["apiClient"],
        usedBy: ["PostsContext.jsx"],
        connectsTo:
          "return response.data extracts the JSON body. PostsContext receives the new post object and calls setPosts() to update state.",
        keyFunction: `// Service receives parsed response
create: async (data) => {
  const response = await apiClient.post('/posts/', data);
  return response.data; // Axios auto-parses JSON
  // Returns: {id: 42, content: 'Hello!', ...}
}`,
      },
    ],
    code: `// Response travels back: Server → Network → Browser → JS

// HTTP Response:
// ┌─────────────────────────────────────┐
// │ Status: 201 Created                 │
// ├─────────────────────────────────────┤
// │ Headers:                            │
// │   Content-Type: application/json    │
// │   Access-Control-Allow-Origin: *    │
// ├─────────────────────────────────────┤
// │ Body (JSON string):                 │
// │   {"id":42,"content":"Hello!",      │
// │    "type":"thoughts",               │
// │    "author":{"id":1,"username":     │
// │    "pablo"},"likes_count":0}        │
// └─────────────────────────────────────┘

// postsService.js receives:
const newPost = await apiClient.post("/posts/", data);
return newPost.data;  // Axios parses JSON → JS object`,
    explanation:
      "The HTTP response travels back through the network. Axios parses the JSON body automatically and returns it to the service function.",
  },
  {
    id: "frontend-render",
    label: "Frontend Renders",
    sublabel: "DOM Update / UI Render",
    color: "#22c55e",
    files: [
      {
        path: "src/contexts/PostsContext.jsx",
        name: "PostsContext.jsx",
        description:
          "Context's createPost() receives the new post, calls setPosts() to add it to state. React's state update triggers re-render of all consuming components.",
        imports: ["postsService", "useState"],
        usedBy: ["Home.jsx", "TimelineRiverFeed.jsx", "PostCard.jsx"],
        connectsTo:
          "setPosts(prev => [newPost, ...prev]) triggers React reconciliation. All components using usePosts() re-render with updated posts array.",
        keyFunction: `// State update triggers re-render cascade
const newPost = await postsService.create(postData);
setPosts(prev => [newPost, ...prev]); // Prepend!
// All usePosts() consumers re-render automatically`,
      },
      {
        path: "src/components/pages/Home/components/TimelineRiverFeed.jsx",
        name: "TimelineRiverFeed.jsx",
        description:
          "Component that maps over posts array and renders PostCard for each. Auto re-renders when posts state changes because it uses usePosts() hook.",
        imports: ["usePosts", "PostCard"],
        usedBy: ["Home.jsx"],
        connectsTo:
          "const { posts } = usePosts() subscribes to context. When setPosts updates, React re-renders this component with new posts array.",
        keyFunction: `// Component subscribes to context, auto-rerenders
const { posts } = usePosts();

return posts.map(post => (
  <PostCard key={post.id} post={post} />
));`,
      },
      {
        path: "src/components/ui/PostCard/PostCard.jsx",
        name: "PostCard.jsx",
        description:
          "Individual post card component displaying content, author info, type badge, and action buttons (like, comment, share).",
        imports: ["usePosts (for like/delete)", "useAuth (for author check)"],
        usedBy: ["TimelineRiverFeed.jsx", "Profile.jsx"],
        connectsTo:
          "Receives post object as prop. Displays post.content, post.author.username. Like button calls postsService.like() → updates likes_count.",
        keyFunction: `// PostCard renders the post data visually
const PostCard = ({ post }) => (
  <article className="post-card">
    <Avatar src={post.author.profile_picture} />
    <h3>{post.author.username}</h3>
    <p>{post.content}</p>
    <button onClick={() => handleLike(post.id)}>
      ❤️ {post.likes_count}
    </button>
  </article>
);`,
      },
    ],
    code: `// PostsContext.jsx - State update triggers re-render
const createPost = async (postData) => {
  const newPost = await postsService.create(postData);
  
  // This setPosts call triggers React re-render!
  setPosts(prev => [newPost, ...prev]);
  
  return { success: true, post: newPost };
};

// TimelineRiverFeed.jsx - Subscribes to context
const { posts } = usePosts();  // Re-renders when posts changes

return (
  <div className="timeline-feed">
    {posts.map(post => (
      <PostCard key={post.id} post={post} />
    ))}
  </div>
);

// User sees new post appear at top of feed instantly! ✨`,
    explanation:
      "JavaScript receives the response, updates React state, and all subscribed components re-render. The new post appears in the feed. The cycle is complete!",
  },
];

/**
 * Data format labels shown below the flow diagram
 * Maps positions to their corresponding data format
 */
export const dataFormatLabels = [
  { color: "purple", label: "HTTP Request" },
  { color: "pink", label: "JSON/REST" },
  { color: "red", label: "SQL Query" },
  { color: "yellow", label: "JSON Response" },
  { color: "green", label: "DOM Update" },
];

/**
 * Legend items explaining the different paths
 */
export const legendItems = [
  {
    color: "indigo",
    title: "Request Path",
    description: "User action → Frontend → Browser → Server → Database",
  },
  {
    color: "yellow",
    title: "Response Path",
    description: "Database → Server → HTTP Response → Frontend → UI Update",
  },
  {
    color: "green",
    title: "Data Formats",
    description: "JS Object → JSON → SQL → JSON → JS Object → DOM",
  },
];
