export default class SortUtils {
  public static insert(element, array, comparer) {
    array.splice(SortUtils.locationOf(element, array, comparer, 0, array.length) + 1, 0, element);
    return array;
  }

  private static locationOf(element, array, comparer, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;  // should be faster than the above calculation

    var c = comparer(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

    switch (c) {
        case -1: return SortUtils.locationOf(element, array, comparer, start, pivot);
        case 0: return pivot;
        case 1: return SortUtils.locationOf(element, array, comparer, pivot, end);
    };
  };
}
