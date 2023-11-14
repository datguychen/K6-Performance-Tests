import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '5s'
}

console.log(' -- init stage --');

export default function (data:string) {
    console.log('-- VU stage --');
    // console.log(data);
    sleep(1);
}

export function setup() {
    console.log('-- setup stage --');
    sleep(10);
    const data:string = 'text';
    return data;
}


export function teardown(data:string) {
    console.log('-- Teardown stage --');
}