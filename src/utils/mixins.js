import debounce from 'lodash/debounce';

// https://github.com/jashkenas/underscore/issues/310#issuecomment-2510502
export function debounceReduce(func, wait, combine) {
	var allArgs,
		context,
		wrapper = debounce(function () {
			var args = allArgs;
			allArgs = undefined;
			func.apply(context, args);
		}, wait);

	return function () {
		context = this;
		allArgs = combine.apply(context, [allArgs, Array.prototype.slice.call(arguments, 0)]);
		wrapper();
	};
}
