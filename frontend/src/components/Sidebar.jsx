import React from "react";
import ScenarioCard from "./ScenarioCard";
import GradientButton from "./ui/GradientButton";
import "../styles/Sidebar.css";

export default function Sidebar({
  scenarios = [],
  selectedId,
  onSelect,
  onToggleFavorite,
  onDiscoverMore,
}) {
  return (
    <aside className="game-sidebar">
      <div className="game-sidebar__top">
        <div className="game-sidebar__avatar">
          <span role="img" aria-label="Larry">
            🤖
          </span>
        </div>
        <h2 className="game-sidebar__title">Chơi với Larry</h2>
        <p className="game-sidebar__subtitle">Học · Hiểu · Hành động</p>
      </div>

      <div className="game-sidebar__divider" />
      <p className="game-sidebar__section-title">Danh sách kịch bản</p>

      <div className="game-sidebar__list">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            icon={scenario.icon}
            title={scenario.title}
            version={scenario.version}
            favorite={scenario.favorite}
            selected={scenario.id === selectedId}
            onSelect={() => onSelect?.(scenario.id)}
            onToggleFavorite={() => onToggleFavorite?.(scenario.id)}
          />
        ))}
      </div>

      <GradientButton variant="outline" fullWidth onClick={onDiscoverMore}>
        Khám phá thêm kịch bản
      </GradientButton>

      <div className="game-sidebar__illustration">
        <div className="game-sidebar__glow" />
        <div className="game-sidebar__robot">🤖</div>
        <span className="game-sidebar__sparkle game-sidebar__sparkle--1">✨</span>
        <span className="game-sidebar__sparkle game-sidebar__sparkle--2">⭐</span>
      </div>
    </aside>
  );
}
