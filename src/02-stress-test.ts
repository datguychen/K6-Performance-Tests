import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

//Evaluate system robustness by pushing it beyond normal capacity.
//Take all TARGET values from load-test.ts and multiply by 2

export let options:Options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '60s', target: 20 },
    { duration: '10s', target: 10 },
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
