/**
 * Flow nodes data representing each step in the full-stack data flow
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
        path: "src/components/PostForm.jsx",
        name: "PostForm.jsx",
        description:
          "React component containing the form with the submit button. Handles user input and form state.",
      },
      {
        path: "src/pages/Feed.jsx",
        name: "Feed.jsx",
        description:
          "Parent page component that renders the PostForm and displays the feed of posts.",
      },
    ],
    code: `// User clicks "Create Post" button
<button onClick={handleSubmit}>
  Create Post
</button>`,
    explanation:
      "The journey begins when a user interacts with the UI—clicking a button, submitting a form, or triggering any event.",
  },
  {
    id: "frontend",
    label: "Frontend",
    sublabel: "JS Execution",
    detail: "HTML/CSS/JavaScript",
    color: "#8b5cf6",
    files: [
      {
        path: "src/components/PostForm.jsx",
        name: "PostForm.jsx",
        description:
          "Contains the handleSubmit function that captures form data and triggers the API call.",
      },
      {
        path: "src/hooks/usePostForm.js",
        name: "usePostForm.js",
        description:
          "Custom React hook that manages form state, validation logic, and submission handling.",
      },
    ],
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
    explanation:
      "JavaScript captures the event, gathers form data, validates it client-side, and prepares to send it to the server.",
  },
  {
    id: "browser",
    label: "Browser",
    sublabel: "Request Creation",
    color: "#a855f7",
    files: [
      {
        path: "src/services/api.js",
        name: "api.js",
        description:
          "Base API configuration with axios/fetch instance, interceptors, and auth headers.",
      },
      {
        path: "src/services/postService.js",
        name: "postService.js",
        description:
          "Service module with createPost(), getPosts(), deletePost() functions for post-related API calls.",
      },
    ],
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
    explanation:
      "The browser packages your data into an HTTP request with headers, method, and body, then sends it over the network.",
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
          "URL routing configuration that maps /api/posts/ to the PostListCreateView.",
      },
      {
        path: "backend/posts/views.py",
        name: "views.py",
        description:
          "Django REST Framework view class handling GET (list) and POST (create) requests.",
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "Serializer that validates incoming JSON data and converts between Python objects and JSON.",
      },
    ],
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
    explanation:
      "The server receives the request, routes it to the correct handler, validates the data, and prepares to interact with the database.",
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
          "Django model defining the Post table schema with fields like title, content, author, created_at.",
      },
      {
        path: "backend/posts/migrations/0001_initial.py",
        name: "0001_initial.py",
        description:
          "Database migration file that creates the posts_post table with all columns and constraints.",
      },
    ],
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
    explanation:
      "The database executes the SQL query, stores the data permanently, and returns the newly created record with its generated ID.",
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
          "The ORM hydrates the returned row data into a Post model instance with all field values.",
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "Serializer converts the Post model instance into a Python dictionary for JSON serialization.",
      },
    ],
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
    explanation:
      "The database returns the stored data. The ORM converts raw SQL results back into application objects.",
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
          "View returns a Response object with serialized data and HTTP 201 Created status code.",
      },
      {
        path: "backend/posts/serializers.py",
        name: "serializers.py",
        description:
          "Serializer.data property provides the final JSON-ready dictionary with nested author data.",
      },
    ],
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
    explanation:
      "The backend packages the data as JSON, sets appropriate status codes and headers, and sends the HTTP response back.",
  },
  {
    id: "http-response",
    label: "HTTP Response",
    sublabel: "Network Transit",
    color: "#84cc16",
    files: [
      {
        path: "src/services/api.js",
        name: "api.js",
        description:
          "API instance receives the response, processes headers, and handles any response interceptors.",
      },
      {
        path: "src/services/postService.js",
        name: "postService.js",
        description:
          "Service function awaits the response, parses JSON body, and returns structured data to caller.",
      },
    ],
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
    explanation:
      "The HTTP response containing status code, headers, and JSON body travels back through the network to the browser.",
  },
  {
    id: "frontend-render",
    label: "Frontend Renders",
    sublabel: "DOM Update / UI Render",
    color: "#22c55e",
    files: [
      {
        path: "src/components/PostList.jsx",
        name: "PostList.jsx",
        description:
          "Component that maps over the posts array and renders each PostCard, re-renders when posts state changes.",
      },
      {
        path: "src/components/PostCard.jsx",
        name: "PostCard.jsx",
        description:
          "Individual post card component displaying title, content, author info, and timestamp.",
      },
      {
        path: "src/context/PostContext.jsx",
        name: "PostContext.jsx",
        description:
          "React Context that holds global posts state, setPosts function triggers re-render of consuming components.",
      },
    ],
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
    explanation:
      "JavaScript receives the response, updates application state, and React re-renders the UI to show the new data. The cycle is complete!",
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
