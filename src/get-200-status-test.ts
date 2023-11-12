import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  vus: 10,
  duration: '10s'
};

export default () => {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, {
    'status is 200': () => res.status === 200,
  });
  sleep(1); //1 call per second
};
