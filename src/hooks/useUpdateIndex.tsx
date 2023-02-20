import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(1);

	// maxIndex must be array length as it is index!
	const updateIndex = (maxIndex: number) => {
		let newIndex = getRandomInt(maxIndex - 1, currentIndex);

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
	return Boolean((index === 0 && maxIndex === 1) || index !== 0);
}
