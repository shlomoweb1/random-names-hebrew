const etthArr = ['jewish', 'christian', 'muslims', 'druze'] as const;

type populateEth = {
    [K in typeof etthArr[number]]: {
        firstName: {
            male: string[],
            female: string[],
            unisex: string[],
        },
        lastNames: string[]
    }
}

let ethnics: populateEth = Object.keys(etthArr).reduce((p, key) => {
    const ethnic = etthArr[key as any];
    p[ethnic] = {
        firstName: {
            male: require('./../../data/ethnic/firstName/male/' + ethnic + '.json'),
            female: require('./../../data/ethnic/firstName/female/' + ethnic + '.json'),
            unisex: require('./../../data/ethnic/firstName/unisex/' + ethnic + '.json')
        },
        lastNames: require('./../../data/ethnic/lastName/' + ethnic + '.json')
    };
    return p;
}, {} as any);


const merged = {
    lastName: etthArr.map(ethnic => ethnics[ethnic].lastNames).reduce((o, v) => [...o, ...v], []),
    firstName: {
        male: etthArr.map(ethnic => ethnics[ethnic].firstName.male).reduce((o, v) => [...o, ...v], []),
        female: etthArr.map(ethnic => ethnics[ethnic].firstName.male).reduce((o, v) => [...o, ...v], []),
        unisex: etthArr.map(ethnic => ethnics[ethnic].firstName.unisex).reduce((o, v) => [...o, ...v], []),
    }
}

const mapGender = {
    'male': 'male',
    'female': 'female',
    'boys': 'male',
    'girls': 'female',
    'unisex': 'unisex'
} as const;

export interface createOptions {
    ethnic?: typeof etthArr[number];
    gender?: keyof typeof mapGender;
    phone?: boolean | string[];
    phoneFormat?: "e164" | "formatted" | "object";
    names?: string[]
}

interface createOutput {
    firstName: string;
    lastName: string;
    fullName: string;
    phone: any;
}

const create = (options?: createOptions) : createOutput => {
    options = options || {};

    let lastName: string, firstName: string;
    let gender = (options.gender && Object.keys(mapGender).indexOf(options.gender) != -1) ? mapGender[options.gender] : ['male', 'female', 'unisex'][Math.floor(Math.random() * ['male', 'female', 'unisex'].length)] as 'male'|'female'|'unisex';

    if (options.ethnic && etthArr.indexOf(options.ethnic) !== -1) {
        lastName = ethnics[options.ethnic].lastNames[getRandom(ethnics[options.ethnic].lastNames.length)]
        firstName = (names => names[getRandom(names.length)])
            (options.gender as typeof mapGender[keyof typeof mapGender] ?
                ethnics[options.ethnic].firstName[options.gender as typeof mapGender[keyof typeof mapGender]] :
                (ethnic=>{
                    const d = ethnics[ethnic].firstName;
                    return Object.keys(d).reduce((p, c) => p.concat((d as any)[c] as string[]), [] as string[])
                })(options.ethnic)
            )
    } else {
        lastName = merged.lastName[getRandom(merged.lastName.length)];
        firstName = merged.firstName[gender][getRandom(merged.firstName[gender].length)]
    }

    const name = { firstName, lastName, fullName: `${firstName} ${lastName}`, phone: null as any }

    if (typeof options.phone != 'undefined' && options.phone) {
        options.phone = (Array.isArray(options.phone)) ? options.phone : []
        let phone = generatePhone(options.phone);
        switch (options.phoneFormat) {
            case 'e164': name.phone = phone.replace(/(\d{1})(\d{2})(\d{3})(\d{4})/, "+972$2$3$4"); break;
            case 'object': name.phone = { number: phone, formatted: phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"), e164: phone.replace(/(\d{1})(\d{2})(\d{3})(\d{4})/, "+972$2$3$4") }; break;
            case 'formatted': name.phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); break;
            default: name.phone = phone; break;
        }

    }

    if (options.names && options.names.length && options.names.indexOf(name.fullName) != -1) return create(options);

    return name
}

const areaCodes = ['050', '051', '052', '053', '054', '055', '058'] as const; // https://he.wikipedia.org/wiki/%D7%A7%D7%99%D7%93%D7%95%D7%9E%D7%AA_%D7%98%D7%9C%D7%A4%D7%95%D7%9F_%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C#.D7.A7.D7.99.D7.93.D7.95.D7.9E.D7.95.D7.AA_.D7.91.D7.90.D7.96.D7.95.D7.A8_.D7.94.D7.97.D7.99.D7.95.D7.92_.D7.9C.D7.98.D7.9C.D7.A4.D7.95.D7.A0.D7.99.D7.9D_.D7.A0.D7.99.D7.99.D7.93.D7.99.D7.9D_05
const generatePhone = (phones?: string[]) : string => {
    phones = phones || [];

    let randomAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    let randomNumber = Math.floor(Math.pow(10, (10 - randomAreaCode.length) - 1) + Math.random() * 9 * Math.pow(10, (10 - randomAreaCode.length) - 1));
    let randomPhone = `${randomAreaCode}${randomNumber}`;
    if (phones.indexOf(randomPhone) == -1) return randomPhone;
    return generatePhone(phones);

}

const getRandom = (num: number) => {
    const rnd = Math.floor(Math.random() * num)
    return rnd;

}

export default create;