function compareValues(a: any, b: any, ascending: boolean) {
  if (a < b) {
    return ascending ? -1 : 1;
  }
  if (a > b) {
    return ascending ? 1 : -1;
  }
  return 0;
}

function compareProperties(a: any, b: any, property: string, ascending: boolean) {
  return compareValues(a[property], b[property], ascending);
}

export default function orderByProperties(properties: string[], ascending = true) {
  return function (a: any, b: any) {
    const result = properties
      .find((property) => compareProperties(a, b, property, ascending) !== 0);
    return result ? compareProperties(a, b, result, ascending) : 0;
  };
}
