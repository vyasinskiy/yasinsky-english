import { useState } from 'react';
import { getRandomIndex } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomIndex(maxIndex, currentIndex);

		// TODO: typeof is not safe check
		if (typeof newIndex === 'number') {
			setCurrentIndex(newIndex);
		}
	};

	return { currentIndex, updateIndex };
}
