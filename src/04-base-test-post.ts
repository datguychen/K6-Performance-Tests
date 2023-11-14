import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  let username = Math.random().toString(36).substring(7);
  let email = `${username}@example.com`;
  let password = Math.random().toString(36).substring(7);

  let payload = JSON.stringify({
    username: username,
    email: email,
    password: password
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = http.post('https://test-api.k6.io/user/register/', payload, params);
  console.log(response.body);

  check(response, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
