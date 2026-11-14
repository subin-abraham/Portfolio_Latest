import type { PortfolioPayload } from "@/lib/portfolio";
import "@/styles/sections.css";

type Props = {
  portfolio: PortfolioPayload | null;
};

const PortfolioSections = ({ portfolio }: Props) => {
  const profile = portfolio?.profile;
  const projects = portfolio?.projects ?? [];
  const blogs = portfolio?.blogs ?? [];
  const testimonials = portfolio?.testimonials ?? [];

  return (
    <>
      <section id="work" className="portfolio-section portfolio-section--alt">
        <p className="portfolio-section__eyebrow">Work</p>
        <h2 className="portfolio-section__title">Selected work</h2>
        <p className="portfolio-section__lede">
          Projects published from Neon.
        </p>
        {projects.length === 0 ? (
          <p className="portfolio-empty">No projects published yet.</p>
        ) : (
          <div className="portfolio-grid">
            {projects.map((project) => (
              <article key={project.id} className="portfolio-card">
                {project.coverUrl ? (
                  <img
                    src={project.coverUrl}
                    alt={project.coverAlt}
                    className="mb-3 h-36 w-full rounded object-cover"
                  />
                ) : null}
                <h3>{project.title}</h3>
                {project.summary ? <p>{project.summary}</p> : null}
                {project.role ? (
                  <span className="portfolio-meta">{project.role}</span>
                ) : null}
                {project.projectUrl ? (
                  <p>
                    <a href={project.projectUrl} target="_blank" rel="noreferrer">
                      View project
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="services" className="portfolio-section">
        <p className="portfolio-section__eyebrow">Services</p>
        <h2 className="portfolio-section__title">Services</h2>
        <p className="portfolio-section__lede">
          {profile?.servicesBlurb?.trim() ||
            "Describe your services in the admin profile editor."}
        </p>
      </section>

      <section id="blog" className="portfolio-section portfolio-section--alt">
        <p className="portfolio-section__eyebrow">Blog</p>
        <h2 className="portfolio-section__title">Writing</h2>
        {blogs.length === 0 ? (
          <p className="portfolio-empty">No published posts yet.</p>
        ) : (
          <div className="portfolio-grid">
            {blogs.map((post) => (
              <article key={post.id} className="portfolio-card">
                <h3>{post.title}</h3>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="testimonials" className="portfolio-section">
        <p className="portfolio-section__eyebrow">Testimonials</p>
        <h2 className="portfolio-section__title">Kind words</h2>
        {testimonials.length === 0 ? (
          <p className="portfolio-empty">No testimonials yet.</p>
        ) : (
          <div className="portfolio-grid">
            {testimonials.map((item) => (
              <article key={item.id} className="portfolio-card">
                <p className="portfolio-quote">“{item.quote}”</p>
                <p className="portfolio-quote-author">
                  {item.authorName}
                  {item.authorTitle || item.authorCompany
                    ? ` — ${[item.authorTitle, item.authorCompany]
                        .filter(Boolean)
                        .join(", ")}`
                    : ""}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="contact" className="portfolio-section portfolio-section--alt">
        <p className="portfolio-section__eyebrow">Contact</p>
        <h2 className="portfolio-section__title">Contact</h2>
        <p className="portfolio-contact-note">
          Contact form arrives in Phase C.{" "}
          {profile?.email
            ? `Meanwhile: ${profile.email}`
            : "Add an email in the admin profile for a temporary contact line."}
        </p>
      </section>
    </>
  );
};

export default PortfolioSections;
