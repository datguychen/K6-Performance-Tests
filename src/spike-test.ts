import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

//Test system response to sudden, significant increases in load.

export let options:Options = {
  stages: [
    { duration: '60s', target: 80 }, //spike
    { duration: '10s', target: 40 },
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
