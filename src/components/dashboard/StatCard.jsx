import Card from "../common/Card.jsx";

const colorMap = {
  green: "text-success",
  blue: "text-accent",
  yellow: "text-warning",
};

function StatCard({ icon, title, value, trend, color = "blue" }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </p>

          <p
            className={`text-3xl font-bold mt-1 ${
              colorMap[color] || colorMap.blue
            }`}
          >
            {value}
          </p>

          {trend && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {trend}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;