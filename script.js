/********** DOM constants **********/
const TEXT_SUBMIT = document.querySelector('#text-button');
const TEXT_AREA = document.querySelector('#text-input');
const FILE_SUBMIT = document.querySelector('#file-input');
const RESULTS = document.querySelector('#results');
const RESULTS_HEADING = document.querySelector('#vanity-heading')
const RESULTS_STATS = document.querySelectorAll('.main-stat')
const FUN_STATS = document.querySelector('#fun-stats');

/********** Word checker functions **********/

/* Returns a string with all non-alphanumeric characters deleted.
inputString: any string of text.
*/
function removeNonWordChars(inputString) {
  return inputString.replace(/\b\W+/g, ' ');
}

/* Returns true if inputString is a pronoun referring to a person.
inputString: string of one word that is or is not a pronoun.
Precondition: inputString is a single word.
*/
function isPronoun(inputString) {
  if ( typeof(inputString) === 'string' && ( isSelfPronoun(inputString) || inputString.match(/\b(you|your|yourself|yourselves|thy|thee|thou|he|him|his|himself|she|her|hers|herself|they|them|their|theirselves|we|us|our|ours|ourselves|who|whom|it)\b/igm) ) ) {
    return true;
  }
  return false;
}

/* Returns true if inputString is a pronoun referring to the self.
inputString: string of one word that is or is not a pronoun.
Precondition: inputString is a single word.
*/
function isSelfPronoun(inputString) {
  if ( typeof(inputString) === 'string' && inputString.match(/\b(i|me|mine|my|myself)\b/igm) ) {
    return true;
  }
  return false;
}

/* Returns array of all pronouns in a given string of text.
inputString: any string of text.
*/
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

/* Returns array of all self-pronouns in a given string of text.
inputString: any string of text.
*/
function selfPronouns(inputString) {
  let inputText = inputString;
  inputText = removeNonWordChars(inputText);
  let words = inputText.split(' ');
  let pronouns = [];
  let i = 0; while (i < words.length) {
    if ( isSelfPronoun(words[i]) ) {
      pronouns.push(words[i]);
    }
    i++;
  }
  return pronouns;
}

/* Returns the quotient of all self-pronouns divided by all pronouns in a given
string of text.
inputString: any string of text.
*/
function selfPronounRatio(inputString) {
  all = allPronouns(inputString);
  self = selfPronouns(inputString);
  return self.length / all.length;
}

/* Returns an array of all words in a given string of text.
inputString: any string of text.
*/
function allWords(inputString) {
  let inputText = inputString;
  inputText = removeNonWordChars(inputText);
  inputText = inputText.trim();
  let words = inputText.split(' ');
  return words;
}

function allSentences(inputString) {
  let inputText;
  inputText = inputString.replace(/(\.|\?|!)+(\s*)/g, '\|');
  inputText = inputText.trim();
  let sentences = inputText.split('|');
  if (sentences[sentences.length-1] === '') { // Checks for empty string at end of final sentence
    sentences.pop();
  }
  return sentences;
}

/**********************************************/

/* Updates webpage with statistical information once text is submitted by user.
submittedText: string of text to be evaluated
*/
function updatePage(submittedText) {
  var currentSelfPronouns = selfPronouns(submittedText);
  var currentPronouns = allPronouns(submittedText);
  var currentWords = allWords(submittedText);
  var currentSentences = allSentences(submittedText);

  var currentVanity = Math.trunc((currentSelfPronouns.length / currentSentences.length) * 100);

  if ( isNaN(currentVanity) ) { // Calculation error check
    console.log('Error!');
  } else {
    RESULTS.style.display = "block";
    FUN_STATS.style.display = "block";
    RESULTS_HEADING.textContent = "Behold, you are " + currentVanity + "% vain!";

    for (var elem of document.querySelectorAll('.stat')) {
      elem.style.fontWeight = "bold";
    }

    updateText(".self-pronoun-sentence-ratio", currentSelfPronouns.length / currentSentences.length);
    updateText(".self-pronoun-pronoun-ratio", Math.trunc(selfPronounRatio(submittedText) * 100) + '%');
    updateText(".self-pronoun-word-ratio", Math.trunc( (currentSelfPronouns.length / currentWords.length) * 100) + '%' );
    updateText(".words", currentWords.length);
    updateText(".pronouns", currentPronouns.length);
    updateText(".self-pronouns", currentSelfPronouns.length);
  }
}

/* Updates text of specified DOM element lists. For use with updatePage() only.
elementName: name of element
text: string containing text content
*/
function updateText(elementName, text) {
  var elementList = document.querySelectorAll(elementName);
  console.log(elementList); // Debugging
  for (var item of elementList) {
    item.textContent = text;
  }
}

/**********************************************/

window.onload = function() {
  TEXT_SUBMIT.addEventListener("click", function() {
    updatePage(TEXT_AREA.value);
  }, false);

  FILE_SUBMIT.addEventListener('change', function(e) {
    let file = FILE_SUBMIT.files[0];
    let textType = /text.*/;
    if (file.type.match(textType)) {
      let reader = new FileReader();
      reader.onload = function(e) {
        updatePage(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert("File not supported!");
    }
  }, false);
}
