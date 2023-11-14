import http from 'k6/http';
import { check } from 'k6';

//Here we can request the data first to use it for the next request

export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');
    const crocodilesJSON = JSON.parse(JSON.stringify(res, null, 2));
    const crocodileId:number = crocodilesJSON[0].id;
    const crocodileName:string = crocodilesJSON[0].name;

    res = http.get(`https://test-api.k6.io/public/crocodiles/${crocodileId}/`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'crocodile name': (r) => JSON.parse(JSON.stringify(r, null, 2)).name === crocodileName
    });

}

/*
crocodilesJSON explanation:

JSON.stringify(res, null, 2):
    JSON.stringify() is a method in JavaScript that converts a JavaScript object or value to a JSON string.
    The first argument, res, is the object or value to be converted to a JSON string.
    The second argument, null, is a replacer function or array. In this case, it is null, indicating that no specific replacer function is used.
    The third argument, 2, is the number of spaces to use for indentation in the resulting JSON string. This argument helps make the JSON string more readable by adding indentation.

JSON.parse(...):
    JSON.parse() is a method that parses a JSON string, constructing the JavaScript value or object described by the string.
    The argument here is the JSON string produced by JSON.stringify(res, null, 2).

const crocodilesJSON = ...:
    The result of parsing the JSON string is assigned to the variable crocodilesJSON.
*/