import { expect } from 'chai';
import rndSentence from './sentences'
describe('Create a random sentance:', ()=>{
    it('Random sentance', ()=>{
        expect(rndSentence()).to.not.be.undefined
    })
})