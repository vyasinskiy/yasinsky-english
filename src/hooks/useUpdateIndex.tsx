import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const updateIndex = (maxIndex: number) => {
		const excludeInt = currentIndex !== 0 ? currentIndex : null;
		const newIndex = getRandomInt(maxIndex, excludeInt);
		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}
