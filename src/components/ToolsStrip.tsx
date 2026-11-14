import { useEffect, useState } from "react";
import { fetchPublicTools, type PublicTool } from "@/admin/lib/api";
import "@/styles/Home.css";

type Props = {
  tools?: PublicTool[] | null;
};

const ToolsStrip = ({ tools: toolsProp }: Props) => {
  const [tools, setTools] = useState<PublicTool[]>(toolsProp ?? []);
  const [brokenIds, setBrokenIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (toolsProp) {
      setTools(toolsProp);
      return;
    }

    let cancelled = false;
    void (async () => {
      const res = await fetchPublicTools();
      if (cancelled || res.ok === false) return;
      setTools(res.data.tools);
    })();

    return () => {
      cancelled = true;
    };
  }, [toolsProp]);

  if (tools.length === 0) return null;

  const renderGroup = (keyPrefix: string, hidden: boolean) => (
    <ul className="tools-strip-group" aria-hidden={hidden || undefined}>
      {tools.map((tool) => {
        const url = tool.imageUrl?.trim() || null;
        const showImage = Boolean(url) && !brokenIds.has(tool.id);

        return (
          <li key={`${keyPrefix}-${tool.id}`} className="tools-strip-item">
            {showImage ? (
              <img
                src={url!}
                alt=""
                className="tools-strip-logo"
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                onError={() => {
                  setBrokenIds((prev) => new Set(prev).add(tool.id));
                }}
              />
            ) : null}
            <span className="tools-strip-name">{tool.name}</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section id="tools" className="tools-strip" aria-label="Tools">
      <div className="tools-strip-viewport">
        <div className="tools-strip-track">
          {renderGroup("a", false)}
          {renderGroup("b", true)}
        </div>
      </div>
    </section>
  );
};

export default ToolsStrip;
