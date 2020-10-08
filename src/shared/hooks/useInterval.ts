import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null) {
	const noop = () => {};
	const savedCallback = useRef(noop);

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export default useInterval;
