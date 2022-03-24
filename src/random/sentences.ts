import sentences = require('../../data/yo-yoo/quots');

const get = () : string=>{


    const randomType = sentences[Object.keys(sentences)[Math.floor(Math.random() * Object.keys(sentences).length)]];

    const selected = randomType.sentances[Math.floor(Math.random() * randomType.sentances.length)];
    if(!selected) return get();

    return selected;
}

export default get;