const SCRATCH_URL =
  "https://scratch.mit.edu/projects/editor/?tutorial=getStarted";

export default function ScratchButton() {
  return (
    <div className="scratch-btn-wrap">
      <a
        href={SCRATCH_URL}
        target="_blank"
        rel="noreferrer"
        className="scratch-btn"
      >
        🎮 Chơi với Larry
      </a>
    </div>
  );
}
