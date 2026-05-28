/*
  # Seed Realistic Course Data

  Realistic courses from major providers
*/

-- Courses
INSERT INTO courses (id, title, description, provider, difficulty, category, duration_hours, instructor_name, skills_covered, prerequisites) VALUES
(
  gen_random_uuid(),
  'Full-Stack Web Development with React & Node.js',
  'Master modern web development by building production-ready applications. Covers React 18, Node.js, PostgreSQL, authentication, API design, and deployment strategies with hands-on projects.',
  'NPTEL',
  'intermediate',
  'web-development',
  120,
  'Dr. Gaurav Raina, IIT Madras',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Authentication', 'Deployment', 'Git'],
  ARRAY['Basic JavaScript', 'HTML/CSS fundamentals']
),
(
  gen_random_uuid(),
  'Machine Learning Fundamentals',
  'Comprehensive introduction to ML: supervised/unsupervised learning, neural networks, practical applications with Python, TensorFlow, and scikit-learn. Includes real-world projects.',
  'DeepLearning.AI',
  'intermediate',
  'machine-learning',
  80,
  'Andrew Ng',
  ARRAY['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Neural Networks', 'Feature Engineering'],
  ARRAY['Python programming', 'Linear Algebra basics', 'Statistics fundamentals']
),
(
  gen_random_uuid(),
  'Cloud Architecture on AWS',
  'Design scalable, fault-tolerant systems on AWS. Covers EC2, S3, Lambda, RDS, cloud-native architecture, cost optimization, and security best practices.',
  'AWS Training',
  'advanced',
  'cloud',
  60,
  'Rohit Bhargava, AWS Solutions Architect',
  ARRAY['AWS EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'IAM', 'VPC', 'Cost Optimization'],
  ARRAY['Basic networking concepts', 'Linux fundamentals']
),
(
  gen_random_uuid(),
  'Data Structures and Algorithms in Python',
  'Essential CS foundations: arrays, linked lists, trees, graphs, sorting, searching, dynamic programming. Includes 200+ coding problems for interview prep.',
  'NPTEL',
  'beginner',
  'computer-science',
  50,
  'Prof. Madhavan Mukund, CMI Chennai',
  ARRAY['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming', 'Time/Space Complexity'],
  ARRAY['Basic Python', 'Problem-solving aptitude']
),
(
  gen_random_uuid(),
  'DevOps Engineering Masterclass',
  'Learn CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, infrastructure as code with Terraform, and monitoring with Prometheus.',
  'Coursera',
  'advanced',
  'devops',
  90,
  'Jenifer Rajkumar, Senior DevOps Engineer',
  ARRAY['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana', 'GitOps'],
  ARRAY['Linux basics', 'Networking fundamentals', 'Scripting experience']
),
(
  gen_random_uuid(),
  'Python for Data Science',
  'Learn Python programming for data analysis. Covers NumPy, Pandas, Matplotlib, Seaborn, and hands-on projects with real datasets.',
  'NPTEL',
  'beginner',
  'data-science',
  45,
  'Prof. R. R. Deshmukh, IIT Kharagpur',
  ARRAY['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Data Wrangling', 'Data Visualization'],
  ARRAY['No prior programming experience required']
),
(
  gen_random_uuid(),
  'Natural Language Processing',
  'Advanced NLP: text processing, embeddings, transformers, BERT, GPT architectures, sentiment analysis, and building chatbots.',
  'DeepLearning.AI',
  'advanced',
  'machine-learning',
  70,
  'Andrew Ng & Younes Bensouda Mourri',
  ARRAY['NLP', 'Transformers', 'BERT', 'GPT', 'Text Classification', 'Named Entity Recognition', 'Sentiment Analysis'],
  ARRAY['Machine Learning fundamentals', 'Deep Learning basics']
),
(
  gen_random_uuid(),
  'System Design for Interviews',
  'Master system design interviews: scalability, load balancing, databases, caching, microservices, and real-world architecture patterns.',
  'Educative',
  'intermediate',
  'system-design',
  40,
  'Design Gurus',
  ARRAY['Scalability', 'Load Balancing', 'Database Design', 'Caching', 'Microservices', 'CAP Theorem', 'Message Queues'],
  ARRAY['Backend development experience', 'Understanding of databases']
);
