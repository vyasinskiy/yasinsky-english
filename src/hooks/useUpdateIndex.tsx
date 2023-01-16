import { useState } from 'react';
import { getRandomDigit } from './helpers';

export function useUpdateIndex(maxIndex: number) {
	const [currentIndex, setCurrentIndex] = useState<number>(
		getRandomDigit(0, maxIndex)
	);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomDigit(currentIndex, maxIndex);
		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}
