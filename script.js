/*
  1. ID text file in DOM
  2. store text file in a variable
  3.
 */
// 1. ID text file in DOM
var testString = "I know how past me would react to the title…”aw, jeez, Richard, are you really sliding into the emo feels again?” With good reason, I would think. Past me, indeed, bore the weight of meaningless interpersonal forces on my shoulders. He knew but the depression of his emotions into the cool earth, where they made imprints that would somehow never take shape inside his own heart.";

/* Word checker functions */

function removeNonWordChars(inputString) {
  return inputString.replace(/\b\W+/g, ' ');
}

function isPronoun(inputString) {
  if ( typeof(inputString) === 'string' && ( isSelfPronoun(inputString) || inputString.match(/\b(you|your|yourself|yourselves|thy|thee|thou|he|him|his|himself|she|her|hers|herself|they|them|their|theirselves|we|us|our|ours|ourselves|who|whom|it)\b/igm) ) ) {
    return true;
  }
  return false;
}

function isSelfPronoun(inputString) {
  if ( typeof(inputString) === 'string' && inputString.match(/\b(i|me|mine|my|myself)\b/igm) ) {
    return true;
  }
  return false;
}

/* Returns array of all self pronouns in inputString */

function allPronouns(inputString) {
  let inputText = inputString;
  inputText = removeNonWordChars(inputText);
  let words = inputText.split(' ');
  let pronouns = [];
  let i = 0;
  while (i < words.length) {
    if ( isPronoun(words[i]) ) {
      pronouns.push(words[i]);
    }
    i++;
  }
  return pronouns;
}

function selfPronouns(inputString) {
  let inputText = inputString;
  inputText = removeNonWordChars(inputText);
  let words = inputText.split(' ');
  let pronouns = [];
  let i = 0;
  while (i < words.length) {
    if ( isSelfPronoun(words[i]) ) {
      pronouns.push(words[i]);
    }
    i++;
  }
  return pronouns;
}

function selfPronounRatio(inputString) {
  all = allPronouns(inputString);
  self = selfPronouns(inputString);
  return self.length / all.length;
}

function wordCount(inputString) {
  let inputText = inputString;
  inputText = removeNonWordChars(inputText);
  let words = inputText.split(' ');
  return words.length;
}



console.log(testString);
console.log("Your string has " + selfPronouns(testString).length + " self pronouns!");
console.log("The pronouns are: ");
console.log(selfPronouns(testString));
console.log(selfPronounRatio(testString));
console.log("There are " + wordCount(testString) + " words in the provided string.");


/**********************************************/

const TEXT_SUBMIT = document.querySelector('#text-button');
const TEXT_AREA = document.querySelector('#text-input');
const FILE_SUBMIT = document.querySelector('#file-input');
var textSubmitted = '';

TEXT_SUBMIT.addEventListener("click", function() {
  textSubmitted = TEXT_AREA.value;
  console.log(textSubmitted);
  updatePage();
}, false);

FILE_SUBMIT.addEventListener("change", function() {
  var file = FILE_SUBMIT.files[0];
  var fr = new FileReader();
  fr.onload = function(e) {
    fr.readAsText(file);
    textSubmitted = fr.result;
  };

  console.log(textSubmitted);
  updatePage();
}, false);


/**********************************************/

function updatePage() {
  var currentSelfPronouns = selfPronouns(textSubmitted);
  var currentPronouns = allPronouns(textSubmitted);
  var currentWords = wordCount(textSubmitted);

  console.log(currentSelfPronouns);
  console.log(currentWords);

  document.querySelector('#vanity-heading').innerHTML = "Behold, you are " + ( (currentSelfPronouns.length / currentWords) * 100) + " % vain!";
}
