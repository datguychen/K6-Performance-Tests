import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  stages: [
    { duration: '10s', target: 10 }, //time should be ~5 minutes, but for this project I will simulate it for a short period.
    { duration: '60s', target: 10 }, //time should be ~30 minutes
    { duration: '10s', target: 1 },
  ]
};

export default () => {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');
  check(response, {
    'status is 200': () => response.status === 200,
  });
  sleep(1); //1 call per second
};
