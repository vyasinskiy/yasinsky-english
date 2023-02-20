import { useState } from 'react';
import { getRandomInt } from './helpers';

export function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(1);

	const updateIndex = (arrayLength: number) => {
		const maxInt = arrayLength - 1;
		let newIndex = getRandomInt(maxInt, currentIndex);

		while (!isAcceptedIndex(newIndex, arrayLength)) {
			newIndex = getRandomInt(maxInt, currentIndex);
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
