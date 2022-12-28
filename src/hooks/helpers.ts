export function getRandomXXX() {
	return getRandomDigit() * getRandomDigit() * getRandomDigit();
}

function getRandomDigit(): number {
	return +(Math.random() * 10).toFixed(0);
}
