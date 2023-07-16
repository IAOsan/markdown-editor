export function isEmptyObject(obj: Object): boolean {
	return Object.getOwnPropertyNames(obj).length === 0;
}

export function getClassName(...str: (string | number | object)[]): string {
	return str
		.reduce((acc: string[], s: string | number | object) => {
			if (!s) return acc;

			const isAnString = typeof s === 'string';
			const isANumber = typeof s === 'number';
			const isAnObject = typeof s === 'object' && s !== null;

			if (isAnString || isANumber) {
				acc.push(s.toString());
			}

			if (isAnObject) {
				const [key, value] = Object.entries(s)[0];
				acc = acc.concat(value ? key : []);
			}

			return acc;
		}, [])
		.join(' ');
}

type ThrottledFunction<T extends any[]> = (...args: T) => void;

export function throttle<T extends any[]>(
	func: (...args: T) => void,
	delay: number
): ThrottledFunction<T> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let lastExecTime = 0;

	return function (this: unknown, ...args: T) {
		const currentTime = Date.now();

		const execute = () => {
			func.apply(this, args);
			lastExecTime = currentTime;
		};

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (currentTime - lastExecTime > delay) {
			execute();
		} else {
			timeoutId = setTimeout(execute, delay);
		}
	};
}
