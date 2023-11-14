// TODO: Difference between old and new tresholds

import { Options } from 'k6/options';
import { sleep, check, group } from 'k6';
import http from 'k6/http';

export let options:Options = {
  thresholds: {
    //This is old http_req_duration threshold, it does not tell us much
    http_req_duration: ['p(95)<6000'],

    //This is a new http_req_duration threshold, it tells us if the response was expected or not
    'http_req_duration{expected_response:true}': ['p(95)<6000'],

    //group threshold
    'group_duration{group:::Main page}': ['p(95)<2000'], //we can add a threshold for a specific status code
    'group_duration{group:::Main page::Main page assets}': ['p(95)<600'], //we can add a threshold for a specific status code
    'group_duration{group:::Mocky page}': ['p(95)<10000'],
    'group_duration{group:::Mocky page::Mocky page assets}': ['p(95)<10000'],
  },
};


export default () => {
    //base page 1
    group('Main page', function() {
        const response = http.get('https://test.k6.io/');
        check(response, {
          'status is 200': () => response.status === 200,
        });

        group('Main page assets', function() {
            http.get('https://test.k6.io/static/js/prisms.js');
            http.get('https://test.k6.io/static/css/site.css');
        });

        sleep(1);
    });
    

    group('Mocky page', function() {
        const response = http.get('https://run.mocky.io/v3/cf26d537-8ad9-42bb-8c5b-8b5f8e945307?mocky-delay=5000ms');
        check(response, {
          'status is 200': () => response.status === 200,
        });

        group('Mocky page assets', function() {
            http.get('https://run.mocky.io/v3/cf26d537-8ad9-42bb-8c5b-8b5f8e945307?mocky-delay=1000ms');
            http.get('https://run.mocky.io/v3/cf26d537-8ad9-42bb-8c5b-8b5f8e945307?mocky-delay=1000ms');
        });

        sleep(1);
    });


    //Unavailable - 503
    group('Unavailable', function() {
        const response = http.get('https://run.mocky.io/v3/b4fd2bda-7223-494d-aa51-3a83aa25d127');
        check(response, {
          'status is 503': () => response.status === 503,
        });

        // group('Unavailable assets', function() {
        //     http.get('https://run.mocky.io/v3/cf26d537-8ad9-42bb-8c5b-8b5f8e945307?mocky-delay=1000ms');
        //     http.get('https://run.mocky.io/v3/cf26d537-8ad9-42bb-8c5b-8b5f8e945307?mocky-delay=1000ms');
        // });

        sleep(1);
    });
};
