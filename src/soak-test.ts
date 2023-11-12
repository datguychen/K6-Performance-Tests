import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

//Expose the system to prolonged loads to identify performance issues over time.

export let options:Options = {
  stages: [
    { duration: '5m', target: 1000 },
    { duration: '12h', target: 1000 },
    { duration: '5h', target: 0 },
  ]
};

export default () => {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');
  check(response, {
    'status is 200': () => response.status === 200,
  });
  sleep(1); //1 call per second
};
