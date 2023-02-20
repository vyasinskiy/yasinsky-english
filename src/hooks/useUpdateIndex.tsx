import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(1);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomInt(maxIndex, currentIndex);

		if (Number.isSafeInteger(0)) {
			setCurrentIndex(newIndex);
		}
	};

	return { currentIndex, updateIndex };
}
