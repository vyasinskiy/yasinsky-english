import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateIndex } from './useUpdateIndex';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export const useWord = () => {
	const { todo, all, succeed, favorite } = useSelector(
		(state: RootState) => state
	);

	useEffect(() => {
		// TODO: 1 excessive update at start
		updateWord();
	}, [todo]);

	const { currentIndex, updateIndex } = useUpdateIndex();

	const updateWord = () => {
		const maxIndex = Object.keys(todo).length;
		updateIndex(maxIndex);
	};

	const currentWord = useMemo(() => {
		const rusKey = Object.keys(todo).sort()[currentIndex];
		const engKey = todo[rusKey][0].engKey;

		const isFavorite = Boolean(
			favorite[rusKey] && favorite[rusKey].includes(engKey)
		);

		return {
			rusKey: rusKey,
			engKey: engKey,
			engContext: todo[rusKey][0].engContext,
			rusContext: todo[rusKey][0].rusContext,
			isFavorite: isFavorite,
		};
	}, [favorite, currentIndex]);

	const checkWord = (value: string) => {
		if (!currentWord) {
			return;
		}

		return {
			isCorrectAnswer: value === currentWord.engKey,
			isPartiallyCorrect: currentWord.engKey.includes(value),
			isSynonym: Boolean(
				all[currentWord.rusKey]?.find((item) => item.engKey === value)
			),
		};
	};

	const prevWord = useRef<typeof currentWord>();

	useLayoutEffect(() => {
		if (!prevWord.current || !currentWord) {
			return;
		}

		if (prevWord.current.engKey === currentWord.engKey) {
			updateWord();
			prevWord.current = currentWord;
		}
	}, [currentIndex]);

	return { currentWord, updateWord, checkWord };
};
