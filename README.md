# Introduction
Wence writing a project in the past, I wanted to mock the database with names that would look realistic in the Hebrew language.

The process of getting the information, creating an array with names is not a realistic task to be done manually. Use microservices (scripting) to scrap websites that contain data of people's names.

Using the Hebrew language is a challenging process as there are not many sources available online and usually there is no API available for such a thing. While searching for research there two sites that pop out.

* babynames.baby-land.co.il: have a list of names for kids, in the markup, the names could be separated by type, boys, girls, unisex names. using nodeJs library of cheerio (like jQuery, just for servers) the service scrap the information

* api.dbs.bh.org.il : is a nice project that has a list of the last name in Hebrew and there heritage meaning or translation.

The microservice goal is to allow you to receive a randomly generated name.

# Example of usage
    - create({gender: 'boys'})
        - options
            - gender: 'boys' / 'male' | 'girls' / 'female' | 'unisex'
            - phone: Boolean // create a unique phony Israeli mobile number
            - phoneFormat: Enum("e164", "formatted", "object", undefined) // International format, local format, all data in object, unformatted number
            - ethnic: ['jewish', 'christian', 'muslims', 'druze']
        - output {firstName: String, lastName: String, fullName: String, phone?: String}
    - batch({amount: 100, gender: 'girls'});
        - options
            - gender: 'boys' | 'girls' | 'unisex'
            - phone: Boolean // create a unique phony Israeli mobile number
            - phoneFormat: Enum("e164", "formatted", "object", undefined) // International format, local format, all data in object, unformatted number
            - ethnic: ['jewish', 'christian', 'muslims', 'druze']
        - output {firstName: String, lastName: String, fullName: String}[]
    - batch(10);
        - output {firstName: String, lastName: String, fullName: String}[]
    - sentences.get()
        - output random string

# Build data
    The source files to extract the data localted in: [ remmebr to use `npm i -D`]
        - scrapt.api.dbs.bh.org.il.js
        - scrapt/babynames.baby-land.co.il.js
        - scrapt/yo-yoo.co.il/quot.js

# CHANGELOG
    - version 0.0.18
        - Added unit testing, test all functions
        - fix bug on phone to current documantation
        - default batch amount equal 1
    - version 0.0.19
        - scrapt from cbs.gov.il, new names database
        - added Ethnic filter [notice, christians don't have unisex names]
    - version 0.0.20
        - upgrade source code to typescript
            - catch logic bugs and fixed
        - publish to github opensource code
        - split test unit for each functionility - using mocha