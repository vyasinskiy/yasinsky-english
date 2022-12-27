import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface CheckTranslationProps {
	value: string;
	targetKey: string;
}

const useCheckTranslation = () => {
	const { all, succeed } = useSelector((state: RootState) => state);

	const checkTranslation = ({ value, targetKey }: CheckTranslationProps) => {
		// const;
	};
};
