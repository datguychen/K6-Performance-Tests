import http from 'k6/http';
import { check } from 'k6';
      

export default function () {
    const bodyToken = JSON.stringify({
        username: 'chen_testtoken',
        password: 'chen'
    });

    const paramsToken = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const resToken = http.post('https://test-api.k6.io/auth/token/login/', bodyToken, paramsToken);
    const accessToken = JSON.parse(resToken.body as string).access

    check(resToken, {
        'status is 200': () => resToken.status === 200,
        'access is obtained': () => JSON.parse(resToken.body as string).access !== null,
    });

    const randomCrocName = "croc_" +(Math.random() + 1).toString(36).substring(7);

    const bodyCroc = JSON.stringify({
        name: randomCrocName,
        sex: "M",
        date_of_birth: "1921-12-12",
    });

    const paramsCroc = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        }
    };

    const resCroc = http.post('https://test-api.k6.io/my/crocodiles/', bodyCroc, paramsCroc);

    check(resCroc, {
        'status is 201 for creation': () => resCroc.status === 201,
    });

}