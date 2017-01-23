export default class ArrayUtils {
  public static insert(element, array, comparer) {
    array.splice(ArrayUtils.locationOf(element, array, comparer, 0, array.length) + 1, 0, element);
    return array;
  }

  private static locationOf(element, array, comparer, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;

    var c = comparer(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

    switch (c) {
        case -1: return ArrayUtils.locationOf(element, array, comparer, start, pivot);
        case 0: return pivot;
        case 1: return ArrayUtils.locationOf(element, array, comparer, pivot, end);
    };
  };

  private static getExtremeIndex(startPos, endPos, array, value, valueOf, high): number {
    let pos = (startPos + endPos) >> 1;

    if (valueOf(array[pos]) == value) {
      while (true) {
        if (high) {
          if (pos + 1 > array.length || valueOf(array[pos + 1]) > value) {
            return pos;
          } else {
            pos += 1;
          }
        } else {
          if (pos - 1 < 0 || valueOf(array[pos - 1]) < value) {
            return pos;
          } else {
            pos -= 1;
          }
        }
      }
    }

    if (startPos == endPos) {
      return startPos;
    }

    if (endPos - startPos == 1) {
      if (high) {
        if (valueOf(array[endPos]) > value) {
          return startPos;
        } else {
          return endPos;
        }
      } else {
        if (valueOf(array[startPos]) < value) {
          return endPos;
        } else {
          return startPos;
        }
      }
    }

    if (valueOf(array[pos]) < value) {
      return ArrayUtils.getExtremeIndex(pos + 1, endPos, array, value, valueOf, high);
    } else {
      return ArrayUtils.getExtremeIndex(startPos, pos - 1, array, value, valueOf, high);
    }
  }

  public static getElementsBetween(startValue: number, endValue: number, array, valueOf) {
    // NOTE: Assuming array is sorted!
    if (array.length === 0)
        return null;

    let low = ArrayUtils.getExtremeIndex(0, array.length - 1, array, startValue, valueOf, false);
    let high = ArrayUtils.getExtremeIndex(low + 1, array.length - 1, array, endValue, valueOf, true);

    // array.slice(low - 1, high + 1);

    // TODO: Return trimmed array
  }
}
