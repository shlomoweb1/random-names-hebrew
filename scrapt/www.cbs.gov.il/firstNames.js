// https://www.cbs.gov.il/he/mediarelease/Pages/2019/%D7%A9%D7%9E%D7%95%D7%AA-%D7%9E%D7%A9%D7%A4%D7%97%D7%94-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2017.aspx
const xls = `https://www.cbs.gov.il/he/mediarelease/doclib/2019/231/11_19_231t2.xls`

const xlsx = require('xlsx');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');



    axios.request({
        url: xls,
        method: 'GET',
        responseType: 'arraybuffer',
        reponseEncoding: 'binary'
    }).then(response=>{
        let {data, status} = response;
        if(!data || status != 200) return console.log(new Error('data or status'));
        const workbook = xlsx.read(data);
        const SheetNames = workbook.SheetNames;
    
        let ethnics = {}

        SheetNames.forEach((sheetName)=>{
            const ethnicType = sheetName.replace(/\d+/, '').trim();
            ethnics[ethnicType] = ethnics[ethnicType] || [];
            const sheet = workbook.Sheets[sheetName];
            let flag = true;
            for(cell in sheet){
                if(flag && sheet[cell].v != 'שם פרטי'){continue;}else{flag = false;}
                if(cell[0] === '!' || cell[0] !== "A" || !sheet[cell].v || sheet[cell].v == 'שם פרטי') continue;
                ethnics[ethnicType].push(sheet[cell].v);
            }
        });

        const mapNames = {
            "יהודים": {gender: "male", ethnic: "Jewish"},
            "יהודיות": {gender: "female", ethnic: "Jewish"},
            "דרוזים": {gender: "male", ethnic: "Druze"},
            "דרוזיות": {gender: "female", ethnic: "Druze"},
            "נוצרים": {gender: "male", ethnic: "Christian"},
            "נוצריות": {gender: "female", ethnic: "Christian"},
            "מוסלמים": {gender: "male", ethnic: "Muslims"},
            "מוסלמיות": {gender: "female", ethnic: "Muslims"}
        }

        let uniqueArr = (acc, el, i, arr)=>{
            if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
        }

        let unisex = {
            Jewish: [...ethnics['יהודיות'].reduce(uniqueArr, []), ...ethnics['יהודיות'].reduce(uniqueArr, []) ].reduce(uniqueArr, []),
            Druze: [...ethnics['דרוזיות'].reduce(uniqueArr, []), ...ethnics['דרוזים'].reduce(uniqueArr, []) ].reduce(uniqueArr, []),
            Christian: [...ethnics['נוצריות'].reduce(uniqueArr, []), ...ethnics['נוצרים'].reduce(uniqueArr, []) ].reduce(uniqueArr, []),
            Muslims: [...ethnics['מוסלמיות'].reduce(uniqueArr, []), ...ethnics['מוסלמים'].reduce(uniqueArr, []) ].reduce(uniqueArr, []),
        }

        fs.ensureDir(path.join(__dirname, '..', '..', 'data', 'ethnic', 'firstName', 'unisex')).then(()=>{
            for(ethnic in unisex){
                fs.writeFile(path.join(__dirname, '..', '..', 'data', 'ethnic', 'firstName', 'unisex', ethnic.toLowerCase()+'.json'), JSON.stringify([...new Set(unisex[ethnic])])).then(()=>{}).catch(e=>console.log(e))
            }
        })


        for(let ethnic in ethnics){
            fs.ensureDir(path.join(__dirname, '..', '..', 'data', 'ethnic', 'firstName', mapNames[ethnic].gender)).then(()=>{
                fs.writeFile(path.join(__dirname, '..', '..', 'data', 'ethnic', 'firstName', mapNames[ethnic].gender, mapNames[ethnic].ethnic.toLowerCase()+'.json'), JSON.stringify([...new Set(ethnics[ethnic])])).then(()=>{}).catch(e=>console.log(e))
            }).catch(e=>console.log(e))
        }
    
    }).catch(e=>console.log(e))


