import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CrudManager from "../components/CrudManager";
import ProfileManager from "../components/ProfileManager";
import ToolsManager from "../components/ToolsManager";
import {
  aboutStatsApi,
  blogsApi,
  categoriesApi,
  educationApi,
  experiencesApi,
  projectsApi,
  skillsApi,
  testimonialsApi,
  type AboutStatRecord,
  type BlogRecord,
  type CategoryRecord,
  type EducationRecord,
  type ExperienceRecord,
  type ProjectRecord,
  type SkillRecord,
  type TestimonialRecord,
} from "../lib/api";
import { signOut, type AdminSessionUser } from "../lib/auth-client";

type Props = {
  admin: AdminSessionUser;
};

type Section =
  | "profile"
  | "aboutStats"
  | "projects"
  | "skills"
  | "categories"
  | "tools"
  | "experience"
  | "education"
  | "blogs"
  | "testimonials";

type NavItem = {
  id: Section;
  label: string;
  icon: ReactNode;
};

const icons = {
  profile: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.2 0-7 2.1-7 4.5V20h14v-1.5C19 16.1 16.2 14 12 14Z"
      />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6h5l1.5 2H18.5A1.5 1.5 0 0 1 20 9.5v7A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5Z"
      />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M12 3 4.5 7v5c0 4.3 3 7.5 7.5 9 4.5-1.5 7.5-4.7 7.5-9V7Z"
      />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M4 5.5h7v7H4Zm9 0h7v4h-7Zm0 7h7v7h-7Zm-9 3h7v4H4Z"
      />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M14.5 6.5a3.5 3.5 0 0 0 4 4L12 17l-5-5 6.5-5.5ZM7 17l-2.5 2.5"
      />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7m-9.5 0h11A1.5 1.5 0 0 1 19 8.5v9A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-9A1.5 1.5 0 0 1 6.5 7Z"
      />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M3 10 12 5l9 5-9 5-9-5Zm4.5 3.2V16c0 1.4 2 2.5 4.5 2.5s4.5-1.1 4.5-2.5v-2.8"
      />
    </svg>
  ),
  blogs: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M6 4.5h9.5L18 7v12.5H6Zm3 5h6M9 13h6M9 16.5h4"
      />
    </svg>
  ),
  testimonials: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M7 9.5h4v4H8.5A1.5 1.5 0 0 1 7 12Zm6 0h4v4H14.5A1.5 1.5 0 0 1 13 12Zm-6 4.5 2.5 3.5M13 14l2.5 3.5"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="m16.5 16.5 4 4M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
      />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M4 11.5 12 5l8 6.5V20H14v-5h-4v5H4Z"
      />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10m4-7h7m-3-3.5L21 12l-3 3.5"
      />
    </svg>
  ),
};

const nav: NavItem[] = [
  { id: "profile", label: "Profile", icon: icons.profile },
  { id: "aboutStats", label: "About stats", icon: icons.skills },
  { id: "projects", label: "Projects", icon: icons.projects },
  { id: "skills", label: "Skills", icon: icons.skills },
  { id: "categories", label: "Categories", icon: icons.categories },
  { id: "tools", label: "Tools", icon: icons.tools },
  { id: "experience", label: "Experience", icon: icons.experience },
  { id: "education", label: "Education", icon: icons.education },
  { id: "blogs", label: "Blogs", icon: icons.blogs },
  { id: "testimonials", label: "Testimonials", icon: icons.testimonials },
];

const sectionMeta: Record<Section, { title: string; hint: string }> = {
  profile: {
    title: "Profile",
    hint: "Hero copy, About section text, portrait, and contact links.",
  },
  aboutStats: {
    title: "About stats",
    hint: "Impact numbers shown as cards in the About section.",
  },
  projects: {
    title: "Projects",
    hint: "Case studies and work that appear under Portfolio.",
  },
  skills: {
    title: "Skills",
    hint: "Technical skills for the public site.",
  },
  categories: {
    title: "Categories",
    hint: "Optional grouping for tools and technology labels.",
  },
  tools: {
    title: "Tools",
    hint: "Icons and logos for the tools strip on the homepage.",
  },
  experience: {
    title: "Experience",
    hint: "Roles and companies shown publicly when active.",
  },
  education: {
    title: "Education",
    hint: "Degrees and institutions for the public resume section.",
  },
  blogs: {
    title: "Blogs",
    hint: "Posts that appear in the Blog section when published.",
  },
  testimonials: {
    title: "Testimonials",
    hint: "Quotes that appear on the public homepage when active.",
  },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const Dashboard = ({ admin }: Props) => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");

  const meta = sectionMeta[section];
  const filteredNav = nav.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  async function onLogout() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  function selectSection(id: Section) {
    setSection(id);
    setSidebarOpen(false);
  }

  return (
    <div className={`admin-app${sidebarOpen ? " is-sidebar-open" : ""}`}>
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark" aria-hidden>
            <svg viewBox="0 0 32 32">
              <path
                fill="currentColor"
                d="M16 3 6 10v12l10 7 10-7V10Zm0 3.2 7 4.9v9.8l-7 4.9-7-4.9v-9.8Z"
              />
              <path
                fill="currentColor"
                opacity="0.55"
                d="M16 9.5 11 13v6l5 3.5 5-3.5v-6Z"
              />
            </svg>
          </span>
          <span className="admin-sidebar__name">Portfolio</span>
        </div>

        <div className="admin-sidebar__quick" aria-hidden>
          <span className="admin-sidebar__quick-btn">{icons.skills}</span>
          <span className="admin-sidebar__quick-btn">{icons.tools}</span>
          <span className="admin-sidebar__quick-btn is-active">
            {icons.projects}
          </span>
        </div>

        <nav className="admin-sidebar__nav">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                section === item.id
                  ? "admin-sidebar__link is-active"
                  : "admin-sidebar__link"
              }
              onClick={() => selectSection(item.id)}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__menu"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            {icons.menu}
          </button>

          <div className="admin-topbar__search-wrap">
            <label className="admin-topbar__search">
              <span className="admin-topbar__search-icon">{icons.search}</span>
              <input
                type="search"
                placeholder="Search sections…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search sections"
              />
            </label>

            {query.trim() && filteredNav.length > 0 ? (
              <div className="admin-topbar__results" role="listbox">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    onClick={() => {
                      selectSection(item.id);
                      setQuery("");
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="admin-topbar__user">
            <div className="admin-topbar__user-meta">
              <strong>{admin.name}</strong>
              <span>{admin.email}</span>
            </div>
            <span className="admin-topbar__avatar" aria-hidden>
              {initials(admin.name) || "A"}
              <i className="admin-topbar__status" />
            </span>
            <button
              type="button"
              className="admin-topbar__logout"
              onClick={() => void onLogout()}
              title="Sign out"
            >
              {icons.logout}
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-welcome">
            <div className="admin-welcome__card">
              <span className="admin-welcome__icon">{icons.home}</span>
              <p>
                Welcome back, <strong>{admin.name.split(" ")[0] || admin.name}</strong>
              </p>
            </div>
            <div className="admin-welcome__note">
              <span className="admin-welcome__badge">{meta.title}</span>
              <p>{meta.hint}</p>
            </div>
          </div>

          <div className="admin-stats" aria-hidden>
            <article className="admin-stat">
              <span className="admin-stat__icon">{icons.projects}</span>
              <div>
                <p>Section</p>
                <strong>{meta.title}</strong>
              </div>
            </article>
            <article className="admin-stat">
              <span className="admin-stat__icon">{icons.profile}</span>
              <div>
                <p>Signed in</p>
                <strong>{admin.name.split(" ")[0] || "Admin"}</strong>
              </div>
            </article>
            <article className="admin-stat">
              <span className="admin-stat__icon">{icons.tools}</span>
              <div>
                <p>Workspace</p>
                <strong>CMS</strong>
              </div>
            </article>
            <article className="admin-stat">
              <span className="admin-stat__icon">{icons.skills}</span>
              <div>
                <p>Status</p>
                <strong>Live</strong>
              </div>
            </article>
          </div>

          <div className="admin-panel-card anim-fade-up">
            {section === "profile" ? <ProfileManager /> : null}
            {section === "aboutStats" ? (
              <CrudManager<AboutStatRecord>
                title="About stats"
                lede="Stat cards under the About intro (value, title, detail)."
                api={aboutStatsApi as never}
                titleKey="title"
                subtitleKey="value"
                fields={[
                  { key: "value", label: "Value (e.g. 3+)", required: true },
                  { key: "title", label: "Title", required: true },
                  { key: "detail", label: "Detail", type: "textarea" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "tools" ? <ToolsManager /> : null}
            {section === "skills" ? (
              <CrudManager<SkillRecord>
                title="Skills"
                lede="Technical skills shown on the public About section."
                api={skillsApi as never}
                titleKey="name"
                subtitleKey="category"
                fields={[
                  { key: "name", label: "Name", required: true },
                  { key: "category", label: "Category" },
                  {
                    key: "proficiency",
                    label: "Proficiency (0–100)",
                    type: "number",
                  },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "categories" ? (
              <CrudManager<CategoryRecord>
                title="Technology categories"
                lede="Optional grouping for tools."
                api={categoriesApi}
                titleKey="name"
                subtitleKey="slug"
                fields={[
                  { key: "name", label: "Name", required: true },
                  { key: "slug", label: "Slug", required: true, slugFrom: "name" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "projects" ? (
              <CrudManager<ProjectRecord>
                title="Projects"
                lede="Published projects appear under Work on the public site."
                api={projectsApi}
                titleKey="title"
                subtitleKey="slug"
                fields={[
                  { key: "title", label: "Title", required: true },
                  { key: "slug", label: "Slug", required: true, slugFrom: "title" },
                  { key: "summary", label: "Summary", type: "textarea" },
                  { key: "description", label: "Description", type: "textarea" },
                  { key: "role", label: "Role" },
                  { key: "techStack", label: "Tech stack" },
                  { key: "projectUrl", label: "Project URL", type: "url" },
                  { key: "repoUrl", label: "Repo URL", type: "url" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isPublished", label: "Published", type: "checkbox" },
                  { key: "featured", label: "Featured", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "experience" ? (
              <CrudManager<ExperienceRecord>
                title="Experience"
                lede="Professional roles shown publicly when active."
                api={experiencesApi}
                titleKey="role"
                subtitleKey="company"
                fields={[
                  { key: "company", label: "Company", required: true },
                  { key: "role", label: "Role", required: true },
                  { key: "location", label: "Location" },
                  { key: "summary", label: "Summary", type: "textarea" },
                  {
                    key: "tags",
                    label: "Tags (one per line)",
                    type: "textarea",
                  },
                  { key: "startDate", label: "Start date" },
                  { key: "endDate", label: "End date" },
                  { key: "isCurrent", label: "Current role", type: "checkbox" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "education" ? (
              <CrudManager<EducationRecord>
                title="Education"
                lede="Education entries for the public site."
                api={educationApi}
                titleKey="degree"
                subtitleKey="institution"
                fields={[
                  { key: "institution", label: "Institution", required: true },
                  { key: "degree", label: "Degree", required: true },
                  { key: "field", label: "Field" },
                  { key: "summary", label: "Summary", type: "textarea" },
                  {
                    key: "tags",
                    label: "Tags (one per line)",
                    type: "textarea",
                  },
                  { key: "startDate", label: "Start date" },
                  { key: "endDate", label: "End date" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "blogs" ? (
              <CrudManager<BlogRecord>
                title="Blogs"
                lede="Published posts appear in the Blog section."
                api={blogsApi}
                titleKey="title"
                subtitleKey="slug"
                fields={[
                  { key: "title", label: "Title", required: true },
                  { key: "slug", label: "Slug", required: true, slugFrom: "title" },
                  { key: "excerpt", label: "Excerpt", type: "textarea" },
                  { key: "body", label: "Body", type: "textarea" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isPublished", label: "Published", type: "checkbox" },
                ]}
              />
            ) : null}
            {section === "testimonials" ? (
              <CrudManager<TestimonialRecord>
                title="Testimonials"
                lede="Active quotes appear on the public homepage."
                api={testimonialsApi}
                titleKey="authorName"
                subtitleKey="authorCompany"
                fields={[
                  {
                    key: "quote",
                    label: "Quote",
                    type: "textarea",
                    required: true,
                  },
                  { key: "authorName", label: "Author name", required: true },
                  { key: "authorTitle", label: "Author title" },
                  { key: "authorCompany", label: "Author company" },
                  { key: "sortOrder", label: "Sort order", type: "number" },
                  { key: "isActive", label: "Active", type: "checkbox" },
                ]}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
