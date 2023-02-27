import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const updateIndex = (arrayLength: number) => {
		const maxIndex = arrayLength - 1;
		let newIndex = getRandomInt(maxIndex, currentIndex);

		while (!isAcceptedIndex(newIndex, maxIndex)) {
			newIndex = getRandomInt(maxIndex, currentIndex);
		}

		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}

function isAcceptedIndex(index: number, maxIndex: number) {
	// we must avoid index === 0 to proceed to rerender after index update
	// as at the end of the game index may be changed from 0 => 0 withour rerender
	return Boolean((index === 0 && maxIndex === 0) || index !== 0);
}
