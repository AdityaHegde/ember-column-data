var extractIdRegex = /:(ember\d+):?/;

export default function(obj) {
  var str = obj.toString(), match = str.match(extractIdRegex);
  return match && match[1];
}
