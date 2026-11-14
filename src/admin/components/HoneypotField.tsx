/**
 * Invisible field for bots. Leave empty — filled values fail server-side.
 * Uses off-screen positioning + tabindex=-1 + autocomplete=off.
 */
const HoneypotField = () => {
  return (
    <div
      aria-hidden="true"
      className="admin-honeypot"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor="admin-website">Website</label>
      <input
        id="admin-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
};

export default HoneypotField;
