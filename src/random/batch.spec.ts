import { expect } from 'chai';
import batchRandomNames from './batch';


describe('Create a random batch method:', ()=>{
    it('with param to return 1 row', ()=>{
        const batch = batchRandomNames();

        batch.then(names=>{
            const amount = 1
            expect(names).to.have.lengthOf(amount);

            for(let i=0; i < amount; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.null;
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        }).catch(e=>{
            console.log(e);
            process.exit();
        })
    });
    it('with param to return 2 row params is a number 2', ()=>{
        const amount = 2
        const batch = batchRandomNames(amount);

        batch.then(names=>{
            expect(names).to.have.lengthOf(amount);

            for(let i=0; i < amount; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.null;
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        })
    });
    it('with param to return 1 row params amount 0', ()=>{
        const amount = 0
        const batch = batchRandomNames({amount});

        batch.then(names=>{
            expect(names).to.have.lengthOf(amount+1);

            for(let i=0; i < amount+1; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.null;
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        })
    });
    it('with param to return 3 row params amount 3', ()=>{
        const amount = 3
        const batch = batchRandomNames({amount});

        batch.then(names=>{
            expect(names).to.have.lengthOf(amount);

            for(let i=0; i < amount; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.null;
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        })
    });
    it('Params {phone: true, phoneFormat: "object", amount: 10}', ()=>{
        const batch = batchRandomNames({amount: 10, phone: true,  phoneFormat: "object"});

        batch.then(names=>{
            expect(names).to.have.lengthOf(10);
            for(let i=0; i < names.length; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.a('object');
                expect(names[i].phone.formatted).to.have.lengthOf(12);
                expect(names[i].phone.number).to.have.lengthOf(10);
                expect(names[i].phone.number).to.match(/^\d{10}$/);        
                expect(names[i].phone.e164).to.have.lengthOf(13);
                expect(names[i].phone.e164).to.match(/^\+\d{12}$/);
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        })


    });
    // a heavy test
    it('** Heavy load ** Params {phone: true, phoneFormat: "object", amount: 100,000}', ()=>{
        const amount = 100000;
        const batch = batchRandomNames({amount, phone: true,  phoneFormat: "object"});

        batch.then(names=>{
            expect(names).to.have.lengthOf(amount);
            for(let i=0; i < names.length; i++){
                expect(names[i].firstName).to.be.a.string;
                expect(names[i].lastName).to.be.a.string;
                expect(names[i].fullName).to.be.a.string;
                expect(names[i].phone).to.be.a('object');
                expect(names[i].phone.formatted).to.have.lengthOf(12);
                expect(names[i].phone.number).to.have.lengthOf(10);
                expect(names[i].phone.number).to.match(/^\d{10}$/);        
                expect(names[i].phone.e164).to.have.lengthOf(13);
                expect(names[i].phone.e164).to.match(/^\+\d{12}$/);
                expect(`${names[i].firstName} ${names[i].lastName}`).to.be.equal(names[i].fullName);
            }
        })


    });
})