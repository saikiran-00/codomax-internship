/* ============================================
   BlogSphere – Blog Management Module
   Handles CRUD operations for blogs
   ============================================ */

const BlogManager = {
  BLOGS_KEY: 'blogsphere_blogs',

  // Get all blogs
  getAll() {
    return JSON.parse(localStorage.getItem(this.BLOGS_KEY) || '[]');
  },

  // Save all blogs
  saveAll(blogs) {
    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(blogs));
  },

  // Get blogs by user
  getByUser(userId) {
    return this.getAll().filter(b => b.authorId === userId);
  },

  // Get published blogs
  getPublished() {
    return this.getAll()
      .filter(b => b.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get a single blog
  getById(id) {
    return this.getAll().find(b => b.id === id) || null;
  },

  // Create a new blog
  create(data) {
    const blogs = this.getAll();
    const blog = {
      id: 'blog_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      title: data.title,
      category: data.category,
      imageUrl: data.imageUrl || '',
      description: data.description,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    blogs.push(blog);
    this.saveAll(blogs);
    return blog;
  },

  // Update a blog
  update(id, data) {
    const blogs = this.getAll();
    const index = blogs.findIndex(b => b.id === id);
    if (index === -1) return null;
    blogs[index] = {
      ...blogs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.saveAll(blogs);
    return blogs[index];
  },

  // Delete a blog
  delete(id) {
    const blogs = this.getAll();
    const filtered = blogs.filter(b => b.id !== id);
    this.saveAll(filtered);
  },

  // Get stats for a user
  getStats(userId) {
    const userBlogs = this.getByUser(userId);
    return {
      total: userBlogs.length,
      published: userBlogs.filter(b => b.status === 'published').length,
      drafts: userBlogs.filter(b => b.status === 'draft').length
    };
  },

  // Search blogs
  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.getPublished();
    return this.getPublished().filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.authorName.toLowerCase().includes(q)
    );
  },

  // Filter by category
  filterByCategory(category) {
    if (!category || category === 'all') return this.getPublished();
    return this.getPublished().filter(b => b.category.toLowerCase() === category.toLowerCase());
  },

  // Get unique categories from published blogs
  getCategories() {
    const blogs = this.getPublished();
    const cats = [...new Set(blogs.map(b => b.category))];
    return cats.sort();
  },

  // Seed sample blogs if none exist
  seedSampleBlogs() {
    if (this.getAll().length > 0) return;
    const sampleBlogs = [
      {
        id: 'blog_sample1',
        title: 'Getting Started with Modern JavaScript',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        description: 'Learn the fundamentals of modern JavaScript, including ES6+ features, async/await, and best practices for clean code.',
        content: 'JavaScript has evolved significantly over the years. In this comprehensive guide, we explore the most important features introduced in ES6 and beyond.\n\nArrow functions provide a concise syntax for writing functions. Template literals make string interpolation easy. Destructuring assignment allows you to unpack values from arrays and objects.\n\nAsync/await has revolutionized how we handle asynchronous operations, making our code more readable and maintainable. Combined with the Fetch API, making network requests has never been simpler.\n\nBest practices include using const and let instead of var, leveraging modules for code organization, and writing pure functions whenever possible.',
        authorId: 'system',
        authorName: 'Sarah Chen',
        status: 'published',
        createdAt: '2026-11-15T10:00:00.000Z',
        updatedAt: '2026-11-15T10:00:00.000Z'
      },
      {
        id: 'blog_sample2',
        title: 'The Art of Minimalist Design',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
        description: 'Discover how minimalist design principles can create stunning user experiences that focus on what truly matters.',
        content: 'Minimalist design is not about removing everything — it is about keeping only what is essential. Every element on the page should have a purpose.\n\nWhitespace is your most powerful tool. It gives elements room to breathe and guides the user\'s eye through the content hierarchy. Typography choices should be deliberate, with clear contrast between headings and body text.\n\nColor palettes should be restrained. Choose a primary accent color and use it sparingly to draw attention to key actions. The best minimalist designs feel effortless, but achieving that simplicity requires careful thought and iteration.\n\nRemember: good design is invisible. When users can accomplish their goals without thinking about the interface, you have succeeded.',
        authorId: 'system',
        authorName: 'Alex Rivera',
        status: 'published',
        createdAt: '2026-11-14T08:30:00.000Z',
        updatedAt: '2026-11-14T08:30:00.000Z'
      },
      {
        id: 'blog_sample3',
        title: '10 Tips for Remote Work Productivity',
        category: 'Lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop',
        description: 'Boost your work-from-home productivity with these proven strategies from experienced remote workers.',
        content: 'Remote work offers incredible flexibility, but it also presents unique challenges. Here are ten proven strategies to stay productive.\n\n1. Create a dedicated workspace that separates work from personal life.\n2. Establish a morning routine that signals the start of your workday.\n3. Use time-blocking to protect your most productive hours.\n4. Take regular breaks — the Pomodoro Technique works wonders.\n5. Communicate proactively with your team.\n\n6. Set clear boundaries with family and housemates.\n7. Invest in good ergonomic equipment.\n8. Use noise-canceling headphones for focused work.\n9. End your day at a consistent time.\n10. Stay social — schedule virtual coffee chats with colleagues.\n\nRemember, productivity is not about working more hours; it is about making the hours you work count.',
        authorId: 'system',
        authorName: 'Maya Patel',
        status: 'published',
        createdAt: '2026-11-13T14:00:00.000Z',
        updatedAt: '2026-11-13T14:00:00.000Z'
      },
      {
        id: 'blog_sample4',
        title: 'Introduction to Cloud Computing',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
        description: 'A beginner-friendly guide to understanding cloud computing concepts, services, and how they power modern applications.',
        content: 'Cloud computing has transformed how businesses build and deploy software. Instead of maintaining physical servers, companies can rent computing resources on demand.\n\nThe three main service models are IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service). Each offers different levels of abstraction and control.\n\nMajor cloud providers include AWS, Google Cloud, and Microsoft Azure. They offer hundreds of services ranging from simple storage to advanced machine learning capabilities.\n\nBenefits include scalability, cost-efficiency, global availability, and reduced maintenance burden. Cloud-native architectures using containers and serverless functions enable teams to ship features faster than ever.',
        authorId: 'system',
        authorName: 'James Wilson',
        status: 'published',
        createdAt: '2026-11-12T09:15:00.000Z',
        updatedAt: '2026-11-12T09:15:00.000Z'
      },
      {
        id: 'blog_sample5',
        title: 'Healthy Eating Habits for Busy Professionals',
        category: 'Health',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        description: 'Simple and practical nutrition tips that fit into a busy schedule without compromising on health or taste.',
        content: 'Eating healthy does not have to be complicated or time-consuming. With a little planning, you can nourish your body even on the busiest days.\n\nMeal prep is the single most impactful habit you can adopt. Spend a couple of hours on Sunday preparing meals for the week. Focus on whole foods: lean proteins, vegetables, whole grains, and healthy fats.\n\nKeep healthy snacks at your desk — nuts, fruit, and yogurt are great options. Stay hydrated throughout the day; often what we perceive as hunger is actually thirst.\n\nAvoid the trap of skipping meals. Regular eating keeps your energy stable and prevents overeating later. And remember, perfection is not the goal — consistency is.',
        authorId: 'system',
        authorName: 'Dr. Lisa Chang',
        status: 'published',
        createdAt: '2026-11-11T11:45:00.000Z',
        updatedAt: '2026-11-11T11:45:00.000Z'
      },
      {
        id: 'blog_sample6',
        title: 'Building Your Personal Brand Online',
        category: 'Business',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        description: 'Learn how to establish a strong personal brand that opens doors to new opportunities in your career.',
        content: 'Your personal brand is what people say about you when you are not in the room. In the digital age, managing that perception is more important than ever.\n\nStart by defining your unique value proposition. What skills, experiences, and perspectives set you apart? Be authentic — people can spot inauthenticity quickly.\n\nChoose your platforms wisely. You do not need to be everywhere. Pick two or three platforms where your target audience hangs out and focus your energy there.\n\nCreate content consistently. Share your knowledge, tell stories, and engage with your community. Quality matters more than quantity, but consistency builds trust and visibility.\n\nYour personal website is your home base. It is the one platform you fully control, so invest in making it professional and reflective of your brand.',
        authorId: 'system',
        authorName: 'Emma Nguyen',
        status: 'published',
        createdAt: '2026-11-10T16:30:00.000Z',
        updatedAt: '2026-11-10T16:30:00.000Z'
      }
    ];
    this.saveAll(sampleBlogs);
  }
};

/* ---------- HOME PAGE BLOG RENDERING ---------- */

function initHomePage() {
  BlogManager.seedSampleBlogs();
  renderBlogCards();
  initSearchAndFilters();
}

function renderBlogCards(blogs) {
  const grid = document.getElementById('blogsGrid');
  if (!grid) return;

  const data = blogs || BlogManager.getPublished();

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <i class="fa-regular fa-newspaper"></i>
        <h3>No blogs found</h3>
        <p>Try a different search term or category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = data.map(blog => createBlogCard(blog)).join('');
}

function createBlogCard(blog) {
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const initials = (blog.authorName || 'User').split(' ').map(n => n[0]).join('').toUpperCase();
  const imgHtml = blog.imageUrl
    ? `<img class="blog-card-img" src="${blog.imageUrl}" alt="${escapeHtml(blog.title)}" onerror="this.outerHTML='<div class=\\'blog-card-img placeholder\\'><i class=\\'fa-regular fa-image\\'></i></div>'">`
    : `<div class="blog-card-img placeholder"><i class="fa-regular fa-image"></i></div>`;

  return `
    <article class="blog-card" data-category="${blog.category.toLowerCase()}">
      ${imgHtml}
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span class="blog-category">${escapeHtml(blog.category)}</span>
          <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
        </div>
        <h3><a href="#" onclick="viewBlog('${blog.id}');return false;">${escapeHtml(blog.title)}</a></h3>
        <p class="excerpt">${escapeHtml(blog.description)}</p>
        <div class="blog-card-footer">
          <div class="blog-author">
            <div class="blog-author-avatar">${initials}</div>
            <span class="blog-author-name">${escapeHtml(blog.authorName || 'Author')}</span>
          </div>
          <a href="#" class="blog-read-more" onclick="viewBlog('${blog.id}');return false;">Read More <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </article>`;
}

function initSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const results = BlogManager.search(this.value);
      renderBlogCards(results);
      // Reset category filter
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.filter-btn[data-category="all"]')?.classList.add('active');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      if (searchInput) {
        const results = BlogManager.search(searchInput.value);
        renderBlogCards(results);
      }
    });
  }

  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const category = this.dataset.category;
      const filtered = BlogManager.filterByCategory(category);
      renderBlogCards(filtered);
      // Clear search
      if (searchInput) searchInput.value = '';
    });
  });
}

/* ---------- VIEW BLOG OVERLAY ---------- */

function viewBlog(blogId) {
  const blog = BlogManager.getById(blogId);
  if (!blog) return;

  let target = document.getElementById('blogViewOverlay');
  if (!target) {
    target = document.createElement('div');
    target.id = 'blogViewOverlay';
    target.className = 'blog-view-overlay';
    document.body.appendChild(target);
  }

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const contentHtml = (blog.content || '').split('\n').filter(p => p.trim()).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  const imgHtml = blog.imageUrl
    ? `<img src="${blog.imageUrl}" alt="${escapeHtml(blog.title)}" onerror="this.style.display='none'">`
    : '';

  target.innerHTML = `
    <div class="blog-view-content">
      <div class="blog-view-header">
        ${imgHtml}
        <button class="close-view" onclick="closeBlogView()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="blog-view-body">
        <span class="blog-category">${escapeHtml(blog.category)}</span>
        <h1>${escapeHtml(blog.title)}</h1>
        <div class="blog-view-meta">
          <span><i class="fa-regular fa-user"></i> ${escapeHtml(blog.authorName || 'Author')}</span>
          <span><i class="fa-regular fa-calendar"></i> ${date}</span>
        </div>
        <div class="blog-content">${contentHtml}</div>
      </div>
    </div>`;

  target.classList.add('active');
  document.body.style.overflow = 'hidden';

  target.addEventListener('click', function(e) {
    if (e.target === target) closeBlogView();
  });
}

function closeBlogView() {
  const overlay = document.getElementById('blogViewOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ---------- DASHBOARD ---------- */

function initDashboard() {
  if (!Auth.requireAuth()) return;

  const user = Auth.getCurrentUser();
  if (!user) {
    Auth.logout();
    window.location.href = 'login.html';
    return;
  }

  // Welcome message
  const welcomeEl = document.getElementById('welcomeUser');
  if (welcomeEl) welcomeEl.textContent = user.name;

  const avatarEl = document.getElementById('sidebarAvatar');
  if (avatarEl) avatarEl.textContent = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  const sidebarName = document.getElementById('sidebarName');
  if (sidebarName) sidebarName.textContent = user.name;

  const sidebarEmail = document.getElementById('sidebarEmail');
  if (sidebarEmail) sidebarEmail.textContent = user.email;

  updateDashboardStats(user.id);
  renderMyBlogs(user.id);
  initSidebar();
}

function updateDashboardStats(userId) {
  const stats = BlogManager.getStats(userId);
  const totalEl = document.getElementById('statTotal');
  const pubEl = document.getElementById('statPublished');
  const draftEl = document.getElementById('statDrafts');

  if (totalEl) totalEl.textContent = stats.total;
  if (pubEl) pubEl.textContent = stats.published;
  if (draftEl) draftEl.textContent = stats.drafts;
}

function renderMyBlogs(userId) {
  const tbody = document.getElementById('myBlogsTable');
  if (!tbody) return;

  const blogs = BlogManager.getByUser(userId).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (blogs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <i class="fa-regular fa-pen-to-square"></i>
            <h3>No blogs yet</h3>
            <p>Create your first blog post to get started!</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = blogs.map(blog => {
    const date = new Date(blog.updatedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <tr>
        <td class="blog-title-cell" title="${escapeHtml(blog.title)}">${escapeHtml(blog.title)}</td>
        <td>${escapeHtml(blog.category)}</td>
        <td>${date}</td>
        <td><span class="status-badge ${blog.status}">${blog.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="editBlog('${blog.id}')"><i class="fa-regular fa-pen-to-square"></i> Edit</button>
            <button class="btn-delete" onclick="confirmDeleteBlog('${blog.id}')"><i class="fa-regular fa-trash-can"></i> Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* ---------- DELETE BLOG ---------- */

let blogToDelete = null;

function confirmDeleteBlog(blogId) {
  blogToDelete = blogId;
  const overlay = document.getElementById('deleteModal');
  if (overlay) overlay.classList.add('active');
}

function cancelDelete() {
  blogToDelete = null;
  const overlay = document.getElementById('deleteModal');
  if (overlay) overlay.classList.remove('active');
}

function executeDelete() {
  if (blogToDelete) {
    BlogManager.delete(blogToDelete);
    showToast('success', 'Blog deleted successfully!');
    blogToDelete = null;
    const overlay = document.getElementById('deleteModal');
    if (overlay) overlay.classList.remove('active');

    const user = Auth.getCurrentUser();
    if (user) {
      updateDashboardStats(user.id);
      renderMyBlogs(user.id);
    }
  }
}

/* ---------- EDIT BLOG ---------- */

function editBlog(blogId) {
  window.location.href = `create-blog.html?edit=${blogId}`;
}

/* ---------- CREATE / EDIT BLOG PAGE ---------- */

function initCreateBlogPage() {
  if (!Auth.requireAuth()) return;

  const form = document.getElementById('createBlogForm');
  if (!form) return;

  const user = Auth.getCurrentUser();
  if (!user) return;

  // Fill sidebar info
  const avatarEl = document.getElementById('sidebarAvatar');
  if (avatarEl) avatarEl.textContent = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
  const sidebarName = document.getElementById('sidebarName');
  if (sidebarName) sidebarName.textContent = user.name;
  const sidebarEmail = document.getElementById('sidebarEmail');
  if (sidebarEmail) sidebarEmail.textContent = user.email;

  initSidebar();

  // Image preview
  const imageInput = document.getElementById('blogImage');
  const preview = document.getElementById('imagePreview');
  if (imageInput && preview) {
    imageInput.addEventListener('input', function() {
      if (this.value.trim()) {
        preview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.classList.remove('visible')">`;
        preview.classList.add('visible');
      } else {
        preview.classList.remove('visible');
      }
    });
  }

  // Check for edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  let editingBlog = null;

  if (editId) {
    editingBlog = BlogManager.getById(editId);
    if (editingBlog && editingBlog.authorId === user.id) {
      // Populate form
      document.getElementById('blogTitle').value = editingBlog.title || '';
      document.getElementById('blogCategory').value = editingBlog.category || '';
      document.getElementById('blogImage').value = editingBlog.imageUrl || '';
      document.getElementById('blogDescription').value = editingBlog.description || '';
      document.getElementById('blogContent').value = editingBlog.content || '';

      // Update page title
      const pageTitle = document.getElementById('formTitle');
      if (pageTitle) pageTitle.textContent = 'Edit Blog Post';

      const editBadge = document.getElementById('editIndicator');
      if (editBadge) editBadge.style.display = 'inline-flex';

      // Trigger image preview
      if (editingBlog.imageUrl && imageInput) {
        imageInput.dispatchEvent(new Event('input'));
      }
    } else {
      // Not found or not authorized
      window.location.href = 'dashboard.html';
      return;
    }
  }

  // Publish button
  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) {
    publishBtn.addEventListener('click', function(e) {
      e.preventDefault();
      submitBlog('published', editingBlog);
    });
  }

  // Save Draft button
  const draftBtn = document.getElementById('draftBtn');
  if (draftBtn) {
    draftBtn.addEventListener('click', function(e) {
      e.preventDefault();
      submitBlog('draft', editingBlog);
    });
  }
}

function submitBlog(status, editingBlog) {
  const title = document.getElementById('blogTitle');
  const category = document.getElementById('blogCategory');
  const imageUrl = document.getElementById('blogImage');
  const description = document.getElementById('blogDescription');
  const content = document.getElementById('blogContent');

  // Validation
  let valid = true;

  if (Validator.isEmpty(title.value)) {
    Validator.showError(title, 'Blog title is required.');
    valid = false;
  }
  if (Validator.isEmpty(category.value)) {
    Validator.showError(category, 'Please select a category.');
    valid = false;
  }
  if (Validator.isEmpty(description.value)) {
    Validator.showError(description, 'Short description is required.');
    valid = false;
  }
  if (Validator.isEmpty(content.value)) {
    Validator.showError(content, 'Blog content is required.');
    valid = false;
  }

  if (!valid) return;

  const user = Auth.getCurrentUser();
  if (!user) return;

  const data = {
    title: title.value.trim(),
    category: category.value,
    imageUrl: imageUrl.value.trim(),
    description: description.value.trim(),
    content: content.value.trim(),
    authorId: user.id,
    authorName: user.name,
    status
  };

  if (editingBlog) {
    BlogManager.update(editingBlog.id, data);
    showToast('success', status === 'published' ? 'Blog updated and published!' : 'Draft saved successfully!');
  } else {
    BlogManager.create(data);
    showToast('success', status === 'published' ? 'Blog published successfully!' : 'Draft saved successfully!');
  }

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

/* ---------- UTILITY ---------- */

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
