/*************** DOM constants ***************/
const TEXT_SUBMIT = document.querySelector('#text-button');
const TEXT_AREA = document.querySelector('#text-input');
const FILE_SUBMIT = document.querySelector('#file-input');
const RESULTS = document.querySelector('#results');
const RESULTS_HEADING = document.querySelector('#vanity-heading');
const RATING = document.querySelector('.rating');
const FUN_STATS = document.querySelector('#fun-stats');

/*************** Word manipulation/checking/metadata functions ***************/

/*
 * Returns an array of all words in a given string of text.
 */
function words(inputString) {
  let inputText = removeNonWordChars(inputString);
  inputText = inputText.trim();
  return inputText.split(' ');
}

/*
 * Returns an array of all words in a given string of text.
 * Sentences in a string are divided by separators ., ?, and !
 */
function sentences(inputString) {
  // Universalize separators
  let inputText = inputString.replace(/(\.|\?|!)+(\s*)/g, '\|');
  inputText = inputText.trim();
  let sent = inputText.split('|');
  if (sent[sent.length-1] === '') { // Checks for empty string at end of final
                                    // sentence
    sent.pop();
  }
  return sent;
}

/*
 * Returns array of all pronouns in a given string of text.
 * selfPronounsOnly: a pronoun validation function.
 *   false: evaluates to isPronoun
 *   true: evaluates to isSelfPronoun
 */
function pronouns(inputString, selfPronounsOnly=false) {
  let inputText = removeNonWordChars(inputString);
  let wordList = inputText.split(' ');
  let pro = [];
  let i = 0;
  let validate = selfPronounsOnly ? isSelfPronoun : isPronoun;
  while (i < wordList.length) {
    if ( validate(wordList[i]) ) {
      pro.push(wordList[i]);
    }
    i++;
  }
  return pro;
}

/***************** String cleanup and validation functions *****************/

/*
 * Returns a string with all non-alphanumeric characters deleted.
 */
function removeNonWordChars(inputString) {
  return inputString.replace(/\b\W+/g, ' '); // all non-word chars following
                                             // word chars
}

/*
 * Returns true if inputString is a pronoun referring to a person.
 * Precondition: inputString is a single word.
 */
function isPronoun(inputString) {
  // RegExp() constructor used to split long regex into multiple lines for
  // readability. :)
  let pronounRegExp = new RegExp( [
    "\\b", // start of word
    "(you|your|yourself|yourselves|thy|thee|thou", // second person
    "|he|him|his|himself|she|her|hers|herself", // third person
    "|they|them|their|theirselves|it", // third person
    "|we|us|our|ours|ourselves", // first person plural
    "|who|whom)", // possessive
  ].join(""), "igm"
  );
  if ( typeof(inputString) === 'string'
    && ( isSelfPronoun(inputString) || inputString.match(pronounRegExp) ) ) {
    return true;
  }
  return false;
}

/*
 * Returns true if inputString is a pronoun referring to the self.
 * Precondition: inputString is a single word.
 */
function isSelfPronoun(inputString) {
  if (typeof(inputString) === 'string'
    && inputString.match(/\b(i|me|mine|my|myself)\b/igm) ) {
    return true;
  }
  return false;
}

/*
 * Returns a string of a truncated number with only the first two numbers
 * following the floating point OR the original number if it does not contain
 * a floating point.
 *
 * Precondition: num must be a number
 */
function truncate(num) {
  let floatExp = /(\d)*\.\d\d/;
  let truncNum = num.toString();
  if (truncNum.match(/\./)) {
    return truncNum.match(floatExp)[0];
  } else {
    return truncNum;
  }
}

/********************* Helper math functions *********************/

/*
 * Returns the quotients of the lengths of two array-creating functions on
 * a given string.
 *
 */
function selfPronounRatios(inputString) {
  return {
    toWords: pronouns(inputString, true).length /
      words(inputString).length,
    toSentences: pronouns(inputString, true).length /
      sentences(inputString).length,
    toPronouns: pronouns(inputString, true).length /
      pronouns(inputString, false).length
  };
}

/********************* HTML page update functions *************************/

/*
 * Updates text of all DOM elements in a list. For use with updatePage() only.
 * elementName: name of element
 * text: string containing text content
*/
function updateText(elementName, text) {
  let elementList = document.querySelectorAll(elementName);
  //console.log(elementList); // Debugging
  for (let item of elementList) {
    item.textContent = text;
  }
}

/*
 * Returns an array of two strings - the title and the description - that rate
 * an author's vanity based on the self pronoun-to-sentence ratio in a string
 * of text.
 * pronounSentenceRatio: a number representing the ratio of self pronouns to
 * sentences in a string
 * Precondition: pronounSentenceRatio is a number greater than 0
 */
function rateVanity(pronounSentenceRatio) {
  if (pronounSentenceRatio < 0.5) {
    return [
      "Selfless!",
      "You're like a ghost. Ooooo!"
    ];
  } else if (pronounSentenceRatio >= 0.5 && pronounSentenceRatio < 1) {
    return [
      "Typical vain!",
      "You check yourself in the store window reflection."];
  } else if (pronounSentenceRatio >= 1 && pronounSentenceRatio < 1.5) {
    return [
      "Selfish!",
      "You don't <em>actually</em> want to share those Doritos."];
  } else if (pronounSentenceRatio >= 1.5 && pronounSentenceRatio < 2) {
    return [
      "Narcissist!",
      "You need Instagram likes more than oxygen."];
  } else if (pronounSentenceRatio > 2) {
    return [
      "Mega-narcissist!",
      "You're bursting with importance! Just like the president of the U.S.!"];
  }
}

/*
 * Updates webpage with statistical information once text is submitted by user.
 * submittedText: string of text to be evaluated
 */
function updatePage(submittedText) {
  /* Evaluating metadata from submittedText */
  let currentSelfPronouns = pronouns(submittedText, true);
  let currentPronouns = pronouns(submittedText, false);
  let currentWords = words(submittedText);
  let currentSentences = sentences(submittedText);
  // Ratio of self pronouns to sentences
  let currentRatios = selfPronounRatios(submittedText);

  if ( isNaN(currentRatios.toWords) ) { // Calculation error check
    console.error('Error! currentRatios.toWords returned NaN.');
    alert("Hold up! Send in some real text, not a blank page.");
  } else {
    // Reveal elements on page
    RESULTS.classList.add('revealed');
    FUN_STATS.classList.add('revealed');

    // #results section heading & rating
    RESULTS_HEADING.textContent =
      "Behold, your writing exposes you as " +
      truncate(currentRatios.toSentences * 100) + "% vain!";
    let rating = rateVanity(currentRatios.toSentences);
    RATING.innerHTML = "<strong>" + rating[0] + "</strong> " +
                       rating[1];

    // Total #s
    updateText(".words", currentWords.length);
    updateText(".sentences", currentSentences.length);
    updateText(".pronouns", currentPronouns.length);
    updateText(".self-pronouns", currentSelfPronouns.length);
    // Ratios
    updateText(
      ".self-pronoun-word-ratio",
      truncate(currentRatios.toWords * 100) + '%'
    );
    updateText(
      ".self-pronoun-sentence-ratio",
      truncate(currentRatios.toSentences)
    );
    updateText(
      ".self-pronoun-pronoun-ratio",
      truncate(currentRatios.toPronouns * 100) + '%'
    );
  }
}

/**********************************************/

window.onload = function() {
  /* Event listeners for text entry */

  TEXT_SUBMIT.addEventListener("click", function() {
    updatePage(TEXT_AREA.value);
  }, false);

  // Listen for file, then read on submit
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
};
