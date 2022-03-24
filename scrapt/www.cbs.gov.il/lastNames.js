// https://www.cbs.gov.il/he/mediarelease/Pages/2019/%D7%A9%D7%9E%D7%95%D7%AA-%D7%9E%D7%A9%D7%A4%D7%97%D7%94-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2017.aspx
const xls = {
    Jewish: "https://www.cbs.gov.il/he/mediarelease/doclib/2019/037/11_19_037t3.xls",
    Muslims: "https://www.cbs.gov.il/he/mediarelease/doclib/2019/037/11_19_037t4.xls",
    Christian: "https://www.cbs.gov.il/he/mediarelease/doclib/2019/037/11_19_037t5.xls",
    Druze: "https://www.cbs.gov.il/he/mediarelease/doclib/2019/037/11_19_037t6.xls"
}

const xlsx = require('xlsx');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');


Object.keys(xls).forEach((type)=>{
    axios.request({
        url: xls[type],
        method: 'GET',
        responseType: 'arraybuffer',
        reponseEncoding: 'binary'
    }).then(response=>{
        let {data, status} = response;
        if(!data || status != 200) return console.log(new Error('data or status'));
        const workbook = xlsx.read(data);
        const SheetNames = workbook.SheetNames;
    
        const worksheet = workbook.Sheets[SheetNames[0]];
        let names = [];
        for(cell in worksheet){
            if(cell[0] === '!' || cell[0] !== "A" || !worksheet[cell].v || worksheet[cell].v == 'שם משפחה') continue;
            names.push(worksheet[cell].v);
        }

        
        fs.ensureDir(path.join(__dirname, '..', '..', 'data', 'ethnic', 'lastname')).then(()=>{
            fs.writeFile(path.join(__dirname, '..', '..', 'data', 'ethnic', 'lastname', type.toLowerCase()+'.json'), JSON.stringify([...new Set(names)])).then(()=>{}).catch(e=>console.log(e))
        }).catch(e=>console.log(e))
    
    }).catch(e=>console.log(e))
})

