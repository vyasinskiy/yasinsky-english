import { useState } from 'react';
import { getRandomDigit } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomDigit(currentIndex, maxIndex);
		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}
