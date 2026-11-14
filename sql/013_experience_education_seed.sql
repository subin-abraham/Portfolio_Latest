-- Experience / Education: tags column + resume seed data.
-- Safe to re-run (ADD COLUMN IF NOT EXISTS / seed guards by company+role / institution+degree).

ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS tags TEXT NOT NULL DEFAULT '';

ALTER TABLE education
  ADD COLUMN IF NOT EXISTS tags TEXT NOT NULL DEFAULT '';

INSERT INTO experiences (
  company,
  role,
  location,
  summary,
  tags,
  start_date,
  end_date,
  is_current,
  sort_order,
  is_active
)
SELECT
  v.company,
  v.role,
  v.location,
  v.summary,
  v.tags,
  v.start_date,
  v.end_date,
  v.is_current,
  v.sort_order,
  TRUE
FROM (
  VALUES
    (
      'Polus Solutions',
      'Senior Software Engineer 1',
      '',
      'Architected and shipped AI-powered production features — Document Analyzer, AI Chatbot, and Resume Analyzer — while leading technical design and LLM API integrations for live systems.',
      E'Document Analyzer\nAI Chatbot\nResume Analyzer\nLLM API Integration\nTechnical Architecture\nOpenAI',
      'April 2026',
      NULL,
      TRUE,
      0
    ),
    (
      'Polus Solutions',
      'Software Engineer 1',
      '',
      'Engineered scalable enterprise web apps across Angular, Node.js, and Java for US-based clients, delivering modular UI, REST APIs, and on-time releases in cross-timezone Agile teams.',
      E'Angular\nNode.js\nJava\nNext.js\nREST APIs\nAgile / Scrum',
      'February 2023',
      'March 2026',
      FALSE,
      1
    ),
    (
      'Luminar Technolab',
      'Full-Stack Development Intern',
      '',
      'Completed intensive MEAN stack training and delivered multiple mentored full-stack capstone projects with practical command of REST API design and application architecture.',
      E'MongoDB\nExpress.js\nAngular\nNode.js\nCapstone Projects\nREST Design',
      'August 2022',
      'February 2023',
      FALSE,
      2
    )
) AS v(
  company,
  role,
  location,
  summary,
  tags,
  start_date,
  end_date,
  is_current,
  sort_order
)
WHERE NOT EXISTS (
  SELECT 1
  FROM experiences e
  WHERE e.company = v.company
    AND e.role = v.role
);

INSERT INTO education (
  institution,
  degree,
  field,
  summary,
  tags,
  start_date,
  end_date,
  sort_order,
  is_active
)
SELECT
  v.institution,
  v.degree,
  v.field,
  v.summary,
  v.tags,
  v.start_date,
  v.end_date,
  v.sort_order,
  TRUE
FROM (
  VALUES
    (
      'APJ Abdul Kalam Technological University (KTU), Kerala',
      'B.Tech',
      'Electronics & Communication Engineering',
      'Bachelor of Technology in Electronics and Communication Engineering, with continued focus on full-stack engineering through MEAN certification and applied JavaScript practice.',
      E'Electronics & Communication\nKTU Kerala\nMEAN Stack — NCTT\nJavaScript Intermediate\nHackerRank',
      '2018',
      '2022',
      0
    )
) AS v(
  institution,
  degree,
  field,
  summary,
  tags,
  start_date,
  end_date,
  sort_order
)
WHERE NOT EXISTS (
  SELECT 1
  FROM education e
  WHERE e.institution = v.institution
    AND e.degree = v.degree
);
