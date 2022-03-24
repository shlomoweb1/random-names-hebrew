import createRndomName, { createOptions } from './name';

export default (options?: number | {amount: number} & createOptions) : Promise<any[]>=>{
    if(typeof options == 'number') options = {amount: options || 1}
    options = {
        ...options || {},
        amount: (num=>num <= 1 ? 1 : num)(options && options.amount && parseInt(options.amount as unknown as string) ? options.amount : 1),
    };

    let names = [];

    let jobs = [];

    for(let i =0; i <= (options.amount-1); i++){
        const {amount, ...allOptions} = options;
        jobs.push({...allOptions, names: names});
    }

    return Promise.all(jobs.map(options=>new Promise((res)=>{
        return res(createRndomName(options))
    })))

}