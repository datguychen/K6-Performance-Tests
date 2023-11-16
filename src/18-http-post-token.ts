import http from 'k6/http';
import { check } from 'k6';
      

export default function () {
    const body = JSON.stringify({
        username: 'chen_testtoken',
        password: 'chen'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const res = http.post('https://test-api.k6.io/auth/token/login/', body, params);
    console.log("access = " + JSON.parse(res.body as string).access);

    check(res, {
        'status is 200': () => res.status === 200,
        'access is obtained': () => JSON.parse(res.body as string).access !== null,
    });
}