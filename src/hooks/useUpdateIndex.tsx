import { useState } from 'react';
import { getRandomXXX } from './helpers';

export function useUpdateIndex(): [number, () => void] {
	const [currentIndex, setCurrentIndex] = useState<number>(getRandomXXX());

	const updateIndex = () => {
		const newIndex = getRandomXXX(currentIndex);
		setCurrentIndex(newIndex);
	};

	return [currentIndex, updateIndex];
}
