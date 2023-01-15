import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateIndex } from './useUpdateIndex';
import { useEffect, useMemo } from 'react';

export const useGetCurrentWord = () => {
	const { todo } = useSelector((state: RootState) => state);
	const { currentIndex, updateIndex } = useUpdateIndex();

	useEffect(() => {
		const todoLength = Object.keys(todo).length;
		if (todoLength === 1) {
			updateIndex(0);
		}

		updateIndex(todoLength - 1);
	}, [todo]);

	const currentWord = useMemo(() => {
		const rusKey = Object.keys(todo).sort()[currentIndex];

		return {
			rusKey: rusKey,
			engKey: todo[rusKey][0].engKey,
			engContext: todo[rusKey][0].engContext,
			rusContext: todo[rusKey][0].rusContext,
		};
	}, [currentIndex]);

	return currentWord;
};
