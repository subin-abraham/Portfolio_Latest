-- Technical expertise seed from Subin_Abraham_Resume_EU.pdf.
-- Safe to re-run (inserts only when name+category pair is missing).

INSERT INTO skills (name, category, proficiency, sort_order, is_active)
SELECT
  v.name,
  v.category,
  v.proficiency,
  v.sort_order,
  TRUE
FROM (
  VALUES
    -- Languages & Frameworks
    ('JavaScript (ES6+)', 'Languages & Frameworks', 90, 0),
    ('TypeScript', 'Languages & Frameworks', 90, 1),
    ('Python', 'Languages & Frameworks', 70, 2),
    ('Java', 'Languages & Frameworks', 75, 3),

    -- Frontend
    ('Angular', 'Frontend', 90, 10),
    ('Next.js', 'Frontend', 85, 11),
    ('React (familiar)', 'Frontend', 65, 12),
    ('HTML5', 'Frontend', 90, 13),
    ('CSS3', 'Frontend', 90, 14),
    ('SASS', 'Frontend', 85, 15),
    ('Tailwind CSS', 'Frontend', 85, 16),
    ('Bootstrap', 'Frontend', 80, 17),

    -- Backend
    ('Node.js', 'Backend', 90, 20),
    ('Express.js', 'Backend', 85, 21),
    ('REST API Design', 'Backend', 90, 22),
    ('GraphQL', 'Backend', 75, 23),
    ('Spring Boot', 'Backend', 70, 24),

    -- Databases
    ('PostgreSQL', 'Databases', 85, 30),
    ('MySQL', 'Databases', 80, 31),
    ('MongoDB', 'Databases', 80, 32),
    ('SQL', 'Databases', 85, 33),

    -- Cloud & DevOps
    ('AWS QuickSight', 'Cloud & DevOps', 70, 40),
    ('GitHub', 'Cloud & DevOps', 90, 41),
    ('Git', 'Cloud & DevOps', 90, 42),
    ('CI/CD (GitHub Actions)', 'Cloud & DevOps', 75, 43),

    -- AI & Automation
    ('LLM API Integration (OpenAI)', 'AI & Automation', 85, 50),
    ('AI Chatbot Development', 'AI & Automation', 85, 51),
    ('Document Intelligence', 'AI & Automation', 80, 52),

    -- CMS & Tools
    ('Hygraph (Headless CMS)', 'CMS & Tools', 85, 60),
    ('JIRA', 'CMS & Tools', 85, 61),
    ('Agile/Scrum', 'CMS & Tools', 90, 62),
    ('Cursor', 'CMS & Tools', 85, 63),

    -- Testing
    ('Unit Testing', 'Testing', 75, 70),
    ('API Testing', 'Testing', 80, 71)
) AS v(name, category, proficiency, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM skills s
  WHERE s.name = v.name
    AND s.category = v.category
);
