import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { check, sleep } from 'k6';

let httpErrors = new Counter('http_errors');

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<300'],
        'http_req_duration{page:order}': ['p(95)<250'], //new custom threshold for custom tag page:order
        http_errors: ['count==0'],
        'http_errors{page:order}': ['count==0'],
        checks: ['rate>=0.99'],
        'checks{page:order}': ['rate>=0.99'],
    }
}


//The {page:order} tag is used in many places in this test, because we want to verify different aspects of the same request
export default function () {
    let res = http.get('https://run.mocky.io/v3/cef9ccd3-7768-45f4-ab95-d2edd7f90db6');

    if (res.error) {
        httpErrors.add(1);
    }

    check(res, {
        'status is 200': (r) => r.status === 200
    });

    // Submit order
    res = http.get('https://run.mocky.io/v3/92e5fe0a-4cf5-4f1d-9356-65410053a22e?mocky-delay=2000ms',
        {
            tags: {page: 'order'} //new custom tag
        });

    if (res.error) {
        httpErrors.add(1, { page: 'order' }); // { page: 'order' } is a custom tag
    }

    check(res, { 'status is 201': (r) => r.status === 201 }, { page: 'order' }); // { page: 'order' } is a custom tag

    sleep(1);
}