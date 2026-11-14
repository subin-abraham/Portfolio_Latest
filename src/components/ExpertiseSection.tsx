import type { PortfolioPayload } from "@/lib/portfolio";
import "@/styles/Home.css";

type Skill = PortfolioPayload["skills"][number];

type Props = {
  skills?: Skill[] | null;
};

function groupByCategory(skills: Skill[]) {
  const order: string[] = [];
  const map = new Map<string, Skill[]>();

  for (const skill of skills) {
    const category = skill.category.trim() || "Skills";
    if (!map.has(category)) {
      map.set(category, []);
      order.push(category);
    }
    map.get(category)!.push(skill);
  }

  return order.map((category) => ({
    category,
    items: map.get(category)!,
  }));
}

const ExpertiseSection = ({ skills }: Props) => {
  const items = skills ?? [];
  if (items.length === 0) return null;

  const groups = groupByCategory(items);

  return (
    <section
      id="expertise"
      className="expertise"
      aria-labelledby="expertise-heading"
    >
      <div className="expertise__inner">
        <header className="expertise__header">
          <p className="about-impact__tag">
            <span aria-hidden className="about-impact__asterisk">
              ✦
            </span>
            Expertise
          </p>
          <h2 id="expertise-heading" className="expertise__title">
            <span className="about-impact__title-strong">Technical</span>
            <span className="about-impact__title-muted">Stack</span>
          </h2>
          <p className="expertise__lede">
            Tools and technologies I use to design, build, and ship production
            software — grouped by focus so you can scan what matters.
          </p>
        </header>

        <ul className="expertise__groups">
          {groups.map((group) => (
            <li key={group.category} className="expertise__group">
              <h3 className="expertise__category">
                <span aria-hidden className="about-impact__asterisk">
                  ✦
                </span>
                {group.category}
              </h3>
              <ul className="expertise__skills">
                {group.items.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExpertiseSection;
