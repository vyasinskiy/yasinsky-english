import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from './store';
import { ErrorBoundary } from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</Provider>
	</React.StrictMode>
);
