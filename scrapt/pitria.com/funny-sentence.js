const url = `https://www.pitria.com/tag/%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D-%D7%9E%D7%A6%D7%97%D7%99%D7%A7%D7%99%D7%9D` // משפטים-מצחיקים
// const rp = require('request-promise');
var cloudscraper = require('cloudscraper');
const fs = require('fs-extra');
const path = require('path');
const $ = require('cheerio');

const dataDir = path.join(__dirname, '..', 'data', 'pitria');
const fileName = path.join(dataDir, 'funnyLines.js');

let topics = {}


const scrapData = (options)=>{
    return new Promise((res, rej)=>{
        cloudscraper.get(options.url,  function(error, response, body) {
            if(error) return rej(error);
        
        
            const articles = $('.listing.listing-grid article', body);
            
            articles.each(function(index, el){
                let title = $('h2.title a', el).text().trim().replace(/^\d+\s/, '');
                let tag = $('.term-badge a', el).text().trim().replace(/^\d+\s/, ''); 
                let url = $('h2.title a', el).attr('href');
                let description = $('.post-summary', el).text().trim()
                let published = $('.post-meta time', el).attr('datetime');

                topics[tag] = topics[tag] || [];
                topics[tag].push({title, url, description, published})
            });

            const hasNextUrl = $('.pagination .older a[rel="next"]', body).attr('href');
            if(!hasNextUrl) return res();


            return scrapData({url: hasNextUrl}).then(()=>res()).catch(e=>rej(e));
        
        })
    })
}


scrapData({url}).then(()=>{
    console.log(topics)
}).catch(e=>console.log(e));


