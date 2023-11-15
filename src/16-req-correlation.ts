import http from 'k6/http';
import { check } from 'k6';

//Here we can request the data first to use it for the next request

export default function () {
    const res1 = http.get('https://test-api.k6.io/public/crocodiles/');

    if (res1 !== null) {
        const crocodilesJSON = JSON.parse(res1.body as string);
        const crocodileName = JSON.parse(res1.body as string)[0].name;

        console.log('First Croc name: ' + crocodileName);

        if (crocodilesJSON.length > 0) {
            const crocodileId: number = crocodilesJSON[0].id;
            const res2 = http.get(`https://test-api.k6.io/public/crocodiles/${crocodileId}/`);

            check(res2, {
                'status is 200': () => res2.status === 200,
                'crocodile name': () => JSON.parse(res2.body as string).name === crocodileName
            });
        }
    }
}