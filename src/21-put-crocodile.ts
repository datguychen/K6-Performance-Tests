import http from 'k6/http';
import { check } from 'k6';
      

export default function () {

    // ====LOGIN====
    const bodyToken = JSON.stringify({
        username: 'chen_testtoken',
        password: 'chen'
    });

    const paramsToken = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const resToken = http.post('https://test-api.k6.io/auth/token/login/', bodyToken, paramsToken);
    const accessToken = JSON.parse(resToken.body as string).access

    check(resToken, {
        'status is 200': () => resToken.status === 200,
        'access is obtained': () => JSON.parse(resToken.body as string).access !== null,
    });

    // ====Create Croc====

    const randomCrocName = "croc_" +(Math.random() + 1).toString(36).substring(7);

    const bodyCroc = JSON.stringify({
        name: randomCrocName,
        sex: "M",
        date_of_birth: "1921-12-12",
    });

    const paramsCroc = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        }
    };

    const resCroc = http.post('https://test-api.k6.io/my/crocodiles/', bodyCroc, paramsCroc);

    check(resCroc, {
        'status is 201 for creation': () => resCroc.status === 201,
    });

    // ====Get Croc Name and ID====

    const resCrocGet = http.get('https://test-api.k6.io/my/crocodiles/', paramsCroc);
    const resCrocNames = JSON.parse(resCrocGet.body as string);
    const resCrocLastName = resCrocNames[resCrocNames.length - 1].name;
    const resCrocLastId = resCrocNames[resCrocNames.length - 1].id;
    console.log("Crocodile Name before update: " + resCrocLastName);

    // ====Edit Crod Name====

    const randomCrocNameUpdate = "croc_" +(Math.random() + 1).toString(36).substring(7);

    const bodyUpdateCroc = JSON.stringify({
        name: randomCrocNameUpdate,
        sex: "M",
        date_of_birth: "1921-12-12",
    });

    http.put(`https://test-api.k6.io/my/crocodiles/${resCrocLastId}/`, bodyUpdateCroc, paramsCroc);

    // ====Get Updated Croc Name====

    const resCrocGetUpdate = http.get('https://test-api.k6.io/my/crocodiles/', paramsCroc);
    const resCrocUpdateNames = JSON.parse(resCrocGetUpdate.body as string);
    const resCrocUpdateLastName = resCrocUpdateNames[resCrocUpdateNames.length - 1].name;
    const resCrocLastIdUpdated = resCrocNames[resCrocNames.length - 1].id;
    console.log("Crocodile Name after update: " + resCrocUpdateLastName);

    // ====Check Croc Name and ID====
    if(resCrocLastIdUpdated === resCrocLastId){
        console.log("Correct Croc");
        if(resCrocLastName !== resCrocUpdateLastName){
            console.log("Crocodile name is updated")
        } else {
            console.log("Crocodile name is not updated");
        };
    } else {
        console.log("Wrong Croc");
    };
}

//TODO: Create a nice looking code with 10 VUS load test creating many crocodiles at once and then updating them while validating the data