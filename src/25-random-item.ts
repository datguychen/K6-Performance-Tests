import http from 'k6/http';
import { check } from 'k6';

interface Crocodile {
    id: string;
}

export function randomItem(arrayOfItems: Array<any>): any {
    return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
}

export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');
    const crocodiles: Crocodile[] = JSON.parse(res.body as string);
    const crocodileIds = crocodiles.map((item: Crocodile) => item.id);
    const crocodileId = randomItem(crocodileIds);

    res = http.get(`https://test-api.k6.io/public/crocodiles/${crocodileId}/`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'crocodile has the correct id': (r) => JSON.parse(res.body as string).id === crocodileId
    });
}
