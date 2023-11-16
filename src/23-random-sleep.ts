import http from 'k6/http';
import { sleep } from 'k6';

function randomIntBetween(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const options = {
    vus: 5,
    duration: '20s'
}

export default function () {
    http.get('https://test.k6.io');

    console.log('- VU stage -');
    sleep(randomIntBetween(1, 3)); // sleep between 1 and 3 seconds.
}