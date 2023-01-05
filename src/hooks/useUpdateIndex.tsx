import { useState } from 'react';
import { getRandomXXX } from './helpers';

type UpdateIndex = (maxIndex: number) => void;

export function useUpdateIndex(): [number, UpdateIndex] {
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const updateIndex = (maxIndex: number) => {
		const newIndex = getRandomXXX(currentIndex, maxIndex);
		setCurrentIndex(newIndex);
	};

	return [currentIndex, updateIndex];
}
