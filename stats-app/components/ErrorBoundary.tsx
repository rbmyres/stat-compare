"use client";

import { Component } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Client error boundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              Something went wrong
            </h2>
            <p className="text-sm text-foreground/50">
              A client-side error occurred.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-md bg-nfl-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nfl-navy/90"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
