import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateIndex } from './useUpdateIndex';
import { useEffect, useMemo, useRef } from 'react';

export const useGetCurrentWord = () => {
	const { todo } = useSelector((state: RootState) => state);

	const maxIndex = Object.keys(todo).length - 1;

	const { currentIndex, updateIndex } = useUpdateIndex(maxIndex);

	const updateWord = () => updateIndex(maxIndex);

	const currentWord = useMemo(() => {
		const rusKey = Object.keys(todo).sort()[currentIndex];

		return {
			rusKey: rusKey,
			engKey: todo[rusKey][0].engKey,
			engContext: todo[rusKey][0].engContext,
			rusContext: todo[rusKey][0].rusContext,
		};
	}, [todo, currentIndex]);

	const prevWord = useRef(currentWord);

	useEffect(() => {
		if (prevWord.current.engKey === currentWord.engKey) {
			updateWord();
		}

		prevWord.current = currentWord;
	}, [currentIndex]);

	return { currentWord, updateWord };
};
