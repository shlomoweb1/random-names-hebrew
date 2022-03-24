const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');


const url = `https://babynames.baby-land.co.il/boys-names/?_sft_name_letter={{latter}}`
const hebrewAlphabet = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];
// const hebrewAlphabet = ["א"];


Promise.all(hebrewAlphabet.map(latter=>new Promise((res,rej)=>{
    let u = url.replace('{{latter}}', encodeURI(latter));
    rp(u).then((html)=>{
        let response = {
            boys: [],
            girls: [],
            unisex: []
        }

        const names = $('#main .search-filter-results article a', html);

        names.map((index, element)=>{
            const el = $(element);
            let type = el.hasClass('boys') ? 'boys' : el.hasClass('girl') ? 'girls' : 'unisex';
            let name = el.text();
            if(name) response[type].push(name);
        })
        return res(response);

    }).catch(e=>rej(e))
}))).then((allNames)=>{


    let response = {
        boys: [],
        girls: [],
        unisex: []
    }

    allNames.forEach((latter)=>{
        response.boys = [...response.boys, ...latter.boys]
        response.girls = [...response.girls, ...latter.girls]
        response.unisex = [...response.unisex, ...latter.unisex]
    })

    response.boys = response.boys.sort();
    response.girls = response.girls.sort();
    response.unisex = response.unisex.sort();

    fs.ensureDir(dataDir).then(()=>{
        fs.writeFile(path.join(dataDir, 'names.js'), `module.exports =  ${JSON.stringify(response, null, 4)}`, ()=>{console.log('done')})
    }).catch(e=>console.log(e))

}).catch(e=>console.log(e))