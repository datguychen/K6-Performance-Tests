import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

export function randomItem(arrayOfItems: Array<any>): any {
    return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
}

const userCredentials = new SharedArray('users with credentials', function () {
    return JSON.parse(open('../assets/users.json')).users;
});

export default function () {

    const randomCredential = randomItem(userCredentials);

    let res = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify(
            {
                username: randomCredential.username,
                password: randomCredential.password
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has access token': (r) => r.json() !== undefined
    });

    const accessToken = JSON.parse(res.body as string).access;
    console.log("accessToken: " + accessToken);
}

