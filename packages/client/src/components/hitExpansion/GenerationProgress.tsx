import './GenerationProgress.css';

interface Props {
  progress: number;
  label?: string;
}

function GenerationProgress({ progress, label = 'Generating molecules...' }: Props) {
  return (
    <div className="he-progress-container">
      <div className="he-progress-label">{label}</div>
      <div className="he-progress-bar">
        <div
          className="he-progress-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="he-progress-pct">{Math.round(progress)}%</div>
    </div>
  );
}

export default GenerationProgress;
