// get family names
const rp = require('request-promise');
const fs = require('fs-extra');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');
var maxPages = 60;

const url = 'https://api.dbs.bh.org.il/v1/search?collection=familyNames&from_={{page}}&q=*';
let total = 0;
let perPage = 0;
let families = [];

const getPage = (page)=>{
    return rp(url.replace('{{page}}', page)).then(data=>{
        return JSON.parse(data);
    }).catch(e=>console.log(e))
}


getPage(0).then(data=>{
    total = data.hits.total;
    perPage = data.hits.hits.length;
    families = (families.concat(data.hits.hits.map(hit=>hit._source.Header.He.split(",")[0].trim())));
    let promises = [];
    maxPages = maxPages || Math.ceil(total/perPage);
    
    for(let i = 1; i < maxPages; i++){
        ((page)=>{
            promises.push(new Promise((res, rej)=>{
                getPage(page).then(data=>{
                    if(!data || !data.hits || !data.hits.hits || !data.hits.hits.length) res([]);
                 return res( data.hits.hits.map(hit=>hit._source.Header.He.split(",")[0].trim()) )
                }).catch(e=>res([]))
            }))
        })(i)
    }

    const runInBatches = (allPromises, batch, limit)=>{
        
          
        return new Promise((resolveMe)=>{
            if(batch >= Math.ceil(allPromises.length/(limit || 15))) {
                return resolveMe(families);
            }

            Promise.all(allPromises.slice( (batch || 0), ((batch || 0) + 1) * (limit || 15))).then(allFamilies=>{
                families = allFamilies.reduce((r,a,i)=>r=[...r,...a], families);
                return runInBatches(allPromises, (batch || 0) + 1, (limit || 15)).then(()=>resolveMe(families)).catch(e=>console.log(e)) ;
            }).catch(e=>runInBatches(allPromises, (batch || 0) + 1, (limit || 15)).then(()=>resolveMe(families)).catch(e=>console.log(e)) )
        })
    }

    function searchStringInArray (str, strArray) {
        for (var j=0; j<strArray.length; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    }

    runInBatches(promises, 0, 5).then((allFamilies)=>{
        
        fs.ensureDir(dataDir).then(()=>{
            fs.writeFile(path.join(dataDir, 'families.js'), `module.exports =  ${ JSON.stringify(allFamilies.filter((value, index, arr)=>searchStringInArray(value, arr) == index).sort(), null, null) }`, ()=>{
                console.log(`check file ${path.join(dataDir, 'families.js')}`)
            })
        }).catch(e=>console.log(e))

    }).catch(e=>console.log(e))

    // Promise.all(promises).then((allFamilies)=>{


    //     console.log(allFamilies.reduce((r, a, i)=>{
    //         return r = [...r, ...a]
    //     }, families).sort() );
    // }).catch(e=>console.log(e))
    
});
