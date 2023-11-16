import http from 'k6/http';
import { check } from 'k6';
      

export default function () {
    const bodyPost = JSON.stringify({
        username: 'chen_testtoken',
        password: 'chen'
    });

    const paramsPost = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const resPost = http.post('https://test-api.k6.io/auth/token/login/', bodyPost, paramsPost);
    const accessToken = JSON.parse(resPost.body as string).access

    check(resPost, {
        'status is 200': () => resPost.status === 200,
        'access is obtained': () => JSON.parse(resPost.body as string).access !== null,
    });

    const paramsGet = {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }
    };

    const resGet = http.get('https://test-api.k6.io/my/crocodiles/', paramsGet);

    check(resGet, {
        'status is 200 for auth': () => resGet.status === 200,
    });

}