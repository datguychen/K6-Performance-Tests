import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  thresholds: {
    http_req_duration: ['p(95)<1000'],

    //https://k6.io/docs/using-k6/tags-and-groups/
    'http_req_duration{status:200}': ['p(95)<1000'], //we can add a threshold for a specific status code
    'http_req_duration{status:201}': ['p(95)<1000'], //cant verify it on this endpoint as we do not create anything, therefore the times are always 0 in raport
  },
};


export default () => {
  http.get('https://test.k6.io/');

  //mocky does not work ATM so this test will fail
  //http.get('https://run.mocky.io/v3/7ba55ab5-2bc8-4d67-b3a6-a85629a70968?mocky-delay=2000ms'); //we can add a delay in mocky to simulate a slow response
};
