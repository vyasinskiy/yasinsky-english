import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex(maxIndex: number) {
	const [currentIndex, setCurrentIndex] = useState<number>(
		getRandomInt(maxIndex)
	);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomInt(maxIndex, currentIndex);
		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}
