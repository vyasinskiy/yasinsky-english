import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateIndex } from './useUpdateIndex';
import { useLayoutEffect, useMemo, useRef } from 'react';

export const useWord = () => {
	const { todo, all, succeed } = useSelector((state: RootState) => state);
	const { currentIndex, updateIndex } = useUpdateIndex();

	const maxIndex = Object.keys(todo).length - 1;
	const updateWord = () => updateIndex(maxIndex);

	const currentWord = useMemo(() => {
		const rusKey = Object.keys(todo).sort()[currentIndex];

		if (!rusKey) {
			return null;
		}

		return {
			rusKey: rusKey,
			engKey: todo[rusKey][0].engKey,
			engContext: todo[rusKey][0].engContext,
			rusContext: todo[rusKey][0].rusContext,
		};
	}, [currentIndex]);

	const checkWord = (value: string) => {
		if (!currentWord) {
			return;
		}

		return {
			isCorrectAnswer: value === currentWord.engKey,
			isPartiallyCorrect: currentWord.engKey.includes(value),
			synonym: {
				isSynonym: Boolean(
					all[currentWord.rusKey].find(
						(item) => item.engKey === value
					)
				),
				isSynonymAlreadySucceed: succeed[currentWord.rusKey]?.find(
					(engKey) => engKey === value
				),
			},
		};
	};

	const prevWord = useRef<typeof currentWord>(null);

	useLayoutEffect(() => {
		if (!prevWord.current || !currentWord) {
			return;
		}

		if (prevWord.current.engKey === currentWord.engKey) {
			console.log('update');
			updateWord();
			prevWord.current = currentWord;
		}
	}, [currentIndex]);

	return { currentWord, updateWord, checkWord };
};
