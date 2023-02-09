import React, { PropsWithChildren } from 'react';

interface ErrorBoundaryProps extends PropsWithChildren {
	name: string;
}

interface ErrorBoudnaryState {
	hasError: boolean;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoudnaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		console.error('getDerivedStateFromError', error);
		return { hasError: true };
	}

	componentDidCatch() {
		// TODO: All logging to server here
	}

	render() {
		if (this.state.hasError) {
			return <h1>Что-то пошло не так.</h1>;
		}

		return this.props.children;
	}
}
