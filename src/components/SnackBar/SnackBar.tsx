import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';
import { RootState } from '../../store';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';
import { Mode } from '../../assets/types';

export const SnackBar = () => {
	const { succeed, mode } = useSelector((state: RootState) => state);
	const [isOpen, setIsOpen] = useState(false);

	const isFirst = useIsFirstRender();

	useEffect(() => {
		if (isFirst || mode === Mode.Favorite) {
			return;
		}

		setIsOpen(true);
	}, [succeed]);

	const message = `Succeed words: ${Object.keys(succeed).length}`;

	return (
		<Snackbar
			open={isOpen}
			onClose={() => setIsOpen(false)}
			autoHideDuration={2000}
			message={message}
			style={{ left: 'auto', right: '20px' }}
		/>
	);
};
