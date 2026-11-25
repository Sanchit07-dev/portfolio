// ─────────────────────────────────────────────
// ERROR BOUNDARIES FOR THE 3D GAME
// SceneErrorBoundary lives inside the R3F reconciler (can only render null),
// reports the failure to the store; SceneErrorFallback is the DOM overlay with
// "Try Again" / "Switch to Classic View". GameErrorBoundary guards the outer
// tree (Canvas init, WebGL context creation).
// ─────────────────────────────────────────────

import React from 'react';
import { useGameStore } from '../../store/gameStore';

function ClassicViewButton({ testId }) {
  const switchToClassic = useGameStore((state) => state.switchToClassic);
  return (
    <button
      onClick={switchToClassic}
      data-testid={testId}
      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 border border-neutral-700 font-semibold text-xs transition-colors"
    >
      Switch to Classic View
    </button>
  );
}

export class SceneErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[Developer Quest] 3D scene error:', error);
    useGameStore.getState().reportSceneError(error?.message || 'The 3D scene failed to render.');
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function SceneErrorFallback() {
  const message = useGameStore((state) => state.sceneError);
  const retryScene = useGameStore((state) => state.retryScene);

  return (
    <div
      data-testid="scene-error-fallback"
      className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-950/85 backdrop-blur-sm p-6 text-center select-none"
    >
      <div className="max-w-md space-y-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">The 3D world hit a snag</h2>
        <p data-testid="scene-error-message" className="text-sm text-neutral-400 leading-relaxed">
          {message || 'Something went wrong while rendering the scene.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            onClick={retryScene}
            data-testid="scene-error-retry-button"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors"
          >
            Try Again
          </button>
          <ClassicViewButton testId="scene-error-classic-button" />
        </div>
      </div>
    </div>
  );
}

export class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '', attempt: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error) {
    console.error('[Developer Quest] game view error:', error);
  }

  render() {
    if (!this.state.hasError) {
      return <React.Fragment key={this.state.attempt}>{this.props.children}</React.Fragment>;
    }
    return (
      <div
        data-testid="game-error-fallback"
        className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-6 text-center select-none"
      >
        <div className="max-w-md space-y-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">The game view hit a snag</h2>
          <p data-testid="game-error-message" className="text-sm text-neutral-400 leading-relaxed">
            {this.state.message}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              onClick={() => this.setState((s) => ({ hasError: false, message: '', attempt: s.attempt + 1 }))}
              data-testid="game-error-retry-button"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors"
            >
              Try Again
            </button>
            <ClassicViewButton testId="game-error-classic-button" />
          </div>
        </div>
      </div>
    );
  }
}