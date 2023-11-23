const dom_app = document.querySelector('#app');
const img_arr = [
    'a', 'Apple','b', 'Ball','c', 'Cat','d', 'Dog',
    'e', 'Egg','f', 'Fish','g', 'Goat','h', 'Heart',
    'i', 'Igloo','j', 'Jellyfish','k', 'Kite',
    'l', 'Llama','m', 'Mario','n', 'Nose','o', 'Orange',
    'p', 'Pig','q', 'Queen','r', 'Rabbit','s', 'Sun',
    't', 'Tree','u', 'Umbrella','v', 'Violin',
    'w', 'Whale','x', 'X-Ray','y', 'Yarn','z', 'Zebra'
];

for(let i = 65; i <= 90; i++) {
    const letter_upper = String.fromCharCode(i);
    const letter_lower = letter_upper.toLowerCase();
    const letter_index = img_arr.indexOf(letter_lower);
    const word = img_arr[(letter_index + 1)];
    const img_src = './img/' + letter_lower + '_' + word.toLowerCase() + '.png';
    
    const div = document.createElement('div');
    div.classList.add('abc_cell');
    const div_letter = document.createElement('div');
    div_letter.classList.add('abc_letter');
    const div_word = document.createElement('div');
    div_word.classList.add('abc_word');
    const img = document.createElement('img');
    div.append(div_letter, img, div_word);
    div_letter.textContent = letter_upper + ' ' + letter_lower;
    div_word.textContent = word;
    
    img.setAttribute('src', img_src);
    img.setAttribute('data-letter', letter_upper);
    img.setAttribute('data-word', word);
    
    img.addEventListener('click', evt => {
        // Dont do anything if its already been clicked
        if(img.classList.contains('img_click')) {
            return;
        }
        let speech = new SpeechSynthesisUtterance();
        // use speech-type attribute to toggle between letter and word
        let speechType = img.toggleAttribute('speech-type');
        if(speechType) {
            speech.text = img.getAttribute('data-letter').toLowerCase();
        } else {
            speech.text = img.getAttribute('data-word');
        }
        window.speechSynthesis.speak(speech);
        img.classList.remove('img_base');
        img.classList.add('img_click');
    });

    img.addEventListener('transitionend', evt => {
        if(evt.propertyName !== 'transform') return;
        img.classList.add('img_base');
        img.classList.remove('img_click');
    })
    
    dom_app.appendChild(div);
}