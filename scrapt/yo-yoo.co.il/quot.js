const startUrl = 'http://www.yo-yoo.co.il/quot/';

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const $ = require('cheerio');
const encoding = require('encoding');

const dataDir = path.join(__dirname, '..', '..', 'data', 'yo-yoo');
const fileName = path.join(dataDir, 'quots.js');

/*
var jq = document.createElement('script');
jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
*/

return axios.request({
    url: startUrl,
    method: 'GET',
    responseType: 'arraybuffer',
    reponseEncoding: 'binary'
})
    .then((response)=>{
        let {data, status} = response;
        if(!status || status !== 200) throw new Error('Http Error');

        let html = encoding.convert(data, 'UTF8', "CP1255").toString();
        
        let links = []
        $('table', html).eq(2).find('a').each((i, el)=>{
            el = $(el);
            links.push({
                url: `${startUrl}${el.attr('href')}`,
                name: el.text().trim()
            })
        });

        Promise.all(links.map(data=>{

            return (function(d){
                return new Promise((res, rej)=>{
                    axios.request({
                        url: d.url,
                        method: 'GET',
                        responseType: 'arraybuffer',
                        reponseEncoding: 'binary'
                    }).then((response)=>{
                        let {data, status} = response;
                        if(!status || status !== 200) return rej(new Error('Http Error'));

                        body = encoding.convert(data, 'UTF8', "CP1255").toString();
                        // const sentances = $('table').eq(2).find('tr td b').map(function(i, el){return $(this).text().trim()}).filter(function(i, s){ !s.match(/\?$/)}).get();
                        const lines = $('table', body).eq(2).find('tr td b').map(function(i, el){return $(this).text().trim()});
                        const sentances = lines.filter(function(i, s){ return !s.match(/\?$/)}).get();
                        const questions = lines.filter(function(i, s){ return s.match(/\?$/)}).get();
                        res({...d, sentances, questions})
                    }).catch(e=>rej(e))
                })
            })(data)
    
    
        })).then(allData=>{
            fs.ensureDir(dataDir).then(()=>fs.writeFile(fileName, `module.exports =${JSON.stringify(allData)}`).then(()=>{}).catch(e=>console.log(e)) ).catch(e=>console.log(e))
        }).catch(e=>console.log(e))       


    })
    .catch(e=>console.log(e));