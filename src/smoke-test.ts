import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

//We need only 1 VU for this test, because smoke test only checks if the API is up and running properly
//Preliminary test to ensure basic functionalities work before detailed testing.

export let options:Options = {
  vus: 1,
  duration: '10s'
};

export default () => {
  const response = http.get('https://test-api.k6.io/');
  check(response, {
    'status is 200': () => response.status === 200,
  });
  sleep(1); //1 call per second
  http.get('https://test-api.k6.io/public/crocodiles/1/'); //check first endpoint
  sleep(2);
  http.get('https://test-api.k6.io/public/crocodiles/'); //check second endpoint
  sleep(2);
};
