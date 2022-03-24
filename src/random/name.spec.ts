// Use mocah to excute this test
import { expect } from 'chai'; // https://www.chaijs.com/api/bdd/
import { default as createRandomName } from './name';

const generalExpect = (name: any, phone: boolean) => {
    expect(name.firstName).to.be.a.string;
    expect(name.lastName).to.be.a.string;
    expect(name.fullName).to.be.a.string;
    if(!phone) expect(name.phone).to.be.null;
    expect(`${name.firstName} ${name.lastName}`).to.be.equal(name.fullName);
}

describe('Create a random name method:', () => {
    it('without params', () => {
        let name = createRandomName();
        generalExpect(name, false);
    });
    it('Param gender [boys]', () => {
        let name = createRandomName({ gender: 'boys' });
        generalExpect(name, false);
    });
    it('Param gender [girls]', () => {
        let name = createRandomName({ gender: 'girls' });
        generalExpect(name, false);
    });
    it('Param gender [unisex]', () => {
        let name = createRandomName({ gender: 'unisex' });
        generalExpect(name, false);
    });
    it('Param phone [true]', () => {
        let name = createRandomName({ phone: true });
        generalExpect(name, true);
        expect(name.phone).to.be.a('string');
        expect(name.phone).to.have.lengthOf(10);
        expect(name.phone).to.match(/^\d{10}$/);
    });
    it('Params {phone: true, phoneFormat: "e164"}', () => {
        let name = createRandomName({ phone: true, phoneFormat: "e164" });
        generalExpect(name, true);
        expect(name.phone).to.be.a('string');
        expect(name.phone).to.have.lengthOf(13);
        expect(name.phone[0]).to.equal('+');
        expect(name.phone).to.match(/^\+\d{12}$/);
    });
    it('Params {phone: true, phoneFormat: "formatted"}', () => {
        let name = createRandomName({ phone: true, phoneFormat: "formatted" });
        generalExpect(name, true);
        expect(name.phone).to.be.a('string');
        expect(name.phone).to.have.lengthOf(12);
        expect(name.phone).to.match(/^\d{3}-\d{3}-\d{4}$/);

        expect(`${name.firstName} ${name.lastName}`).to.be.equal(name.fullName);
    });
    it('Params {phone: true, phoneFormat: "object"}', () => {
        let name = createRandomName({ phone: true, phoneFormat: "object" });
        generalExpect(name, true);
        expect(name.phone).to.be.a('object');
        expect(name.phone.formatted).to.have.lengthOf(12);
        expect(name.phone.number).to.have.lengthOf(10);
        expect(name.phone.number).to.match(/^\d{10}$/);
        expect(name.phone.e164).to.have.lengthOf(13);
        expect(name.phone.e164).to.match(/^\+\d{12}$/);
    });
});