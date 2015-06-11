export default function(hash) {
  for(var k in hash) {
    if(hash.hasOwnProperty(k)) {
      return true;
    }
  }
  return false;
}
