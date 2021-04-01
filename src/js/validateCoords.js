/**
 * Function that validates coords entered by the user
 * @param {String} value input coods value
 */
export default function validateCoords(value) {
  if (/^(\[?-?)((\d|[0-8]\d?|90)\.\d{5,}), ?(-|−)?((\d{1,2}|1[0-7][0-9]|180)\.\d{5,})(\]?)$/.test(value)) {
    const coords = value.split(',');
    const latitude = coords[0].replace(/\[/, '');
    const longitude = coords[1].replace(/\]/, '').replace(/\s/, '');
    return `${latitude}, ${longitude}`;
  }
  return false;
}
