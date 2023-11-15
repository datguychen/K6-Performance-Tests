import http from 'k6/http';
import { check } from 'k6';
      

export default function () {
    const randomText = (Math.random() + 1).toString(36).substring(7);

    const body = JSON.stringify({
        username: 'chen_' + randomText + '_' + Date.now(),
        password: 'chen'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    http.post('https://test-api.k6.io/user/register/', body, params);
}