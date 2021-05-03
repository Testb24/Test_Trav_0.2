// const url = "http://localhost:3000";
// const url = "https://test-trav.herokuapp.com";
// const url = "https://trav-server-0-2.herokuapp.com";

const DATA_TEST_TG =
    `INSERT INTO \`x_world\` VALUES (62,-139,200,1,19596,'AZERAZER',2388,'dada49',30,'ALONE',222,null); 
INSERT INTO \`x_world\` VALUES (716,114,199,2,20571,'00A60',586,'stopol',77,'DvG',145,null);
INSERT INTO \`x_world\` VALUES (717,115,199,2,7154,'00 capi',586,'stopol',77,'DvG',491,null);
INSERT INTO \`x_world\` VALUES (1117,114,198,1,20833,'00B60',1880,'loki',77,'DvG',92,null);
INSERT INTO \`x_world\` VALUES (1118,115,198,2,19838,'00A70',586,'stopol',77,'DvG',409,null);
INSERT INTO \`x_world\` VALUES (1124,121,198,1,19982,'00freia',1880,'loki',77,'DvG',152,null);
INSERT INTO \`x_world\` VALUES (1523,119,197,1,18959,'00thor',1880,'loki',77,'DvG',603,null);
INSERT INTO \`x_world\` VALUES (3583,174,192,3,20511,'V 02',3016,'hayot',171,'N.A',300,null);
INSERT INTO \`x_world\` VALUES (3586,177,192,3,19483,'V 01',3016,'hayot',171,'',0,null);
INSERT INTO \`x_world\` VALUES (4042,-169,190,3,20362,'2',761,'Neywok',0,'',11,null);
INSERT INTO \`x_world\` VALUES (4045,-166,190,3,19236,'1',761,'Neywok',0,'',180,null);`


const btn_s2 = document.getElementById("sql_charge_all_s2");
const btn_s3 = document.getElementById("sql_charge_all_s3");

btn_s2.addEventListener("click", function () { dl_map_SQL(4, "ts2.travian.fr") });
btn_s3.addEventListener("click", function () { dl_map_SQL(4, "ts3.travian.fr") });

async function dl_map_SQL(option, server) {
    // let server = server;
    // let option = option;

    console.log(option);

    //Récupère les _id & pop déjà enregistrés de chaque village :
    let olddata_village = await getData_old_SQL("town", server);

    // console.log(olddata_village)

    let array_village = [];
    olddata_village.forEach(element => {
        array_village.push(element._id);
    });

    // console.log(array_village);

    // let test_array = olddata_village.map(element => element._id)
    // console.log(test_array)

    testYY = await clean_sql_de_travian(server);

    let d = new Date();
    let test_date = d.getDate() + "/" + (d.getMonth() + 1);
    // test_date = "13/4";
    console.log(test_date);
    let array_new_player_id = [];
    let array_new_player = [];

    let array_new_ally_id = [];
    let array_new_ally = [];

    testYY.forEach(element => {
        element = element.split(',');
        // console.log(element)

        if (option == 1 || option == 4) {
            save_town(olddata_village, array_village, element, test_date, server);
        }

        function save_town(olddata_village, array_village, element, test_date, server) {
            // console.log(array_village);
            if (!array_village.includes(parseInt(element[4]))) {

                // console.log("faut enregistrer");

                if (element[5] != "") { element[5] = element[5].substring(1, element[5].length - 1) }
                // if(element[7]!=""){element[5].substring(1, element[5].length - 1)}
                // if(element[9]!=""){element[5].substring(1, element[5].length - 1)}

                let element_vivi = {
                    F: element[0],
                    X: element[1],
                    Y: element[2],
                    T: element[3],
                    _id: server + '_' + element[4],
                    Vid: element[4],
                    Vn: element[5],
                    Uid: element[6],
                    Un: element[7].substring(1, element[7].length - 1),
                    Aid: element[8],
                    An: element[9].substring(1, element[9].length - 1),
                    Pop: [element[10]],
                    Day: [test_date]
                };
                // console.log(element_vivi);

                // console.log(element_vivi);
                // console.log(element);
                let url_api;
                // url_api = "https://test-trav.herokuapp.com//sql/data/town/s2";
                // url_api = "http://localhost:3000/sql/data/town/s2";

                // url_api = url + "/sql/data/town/s2";
                url_api = url + "/api/server/" + server + "/sql/town";

                postData_SQL(url_api, element_vivi)
                    .then(data => {
                        // console.log(data); // JSON data parsed by `data.json()` call
                    });

            } else {
                let ccc = olddata_village.find(truc => truc._id == parseInt(element[4]))
                // console.log("peut-être maj")
                if (!ccc.Day.includes(test_date)) {
                    // console.log("maj")
                    let QQ = ccc.Pop.push(element[10]);
                    let WW = ccc.Day.push(test_date);

                    let element_vivi = {
                        F: element[0],
                        X: element[1],
                        Y: element[2],
                        T: element[3],
                        _id: server + '_' + element[4],
                        Vid: element[4],
                        Vn: element[5],
                        Uid: element[6],
                        Un: element[7].substring(1, element[7].length - 1),
                        Aid: element[8],
                        An: element[9].substring(1, element[9].length - 1),
                        Pop: ccc.Pop,
                        Day: ccc.Day
                    };

                    // console.log(element_vivi);
                    let url_api;
                    // url_api = url + "/sql/data/town/s2";
                    url_api = url + "/api/server/" + server + "/sql/town";

                    updateDATA_SQL(url_api, element_vivi);

                } else {
                    // console.log("pas maj")
                }
            }
        };

        if (option == 2 || option == 4) {
            build_player(element, array_new_player, array_new_player_id);
        }

        function build_player(element, array_new_player, array_new_player_id) {

            let element_player;

            // console.log(array_new_player_id)
            // console.log(array_new_player)
            // console.log(element[6])

            if (!array_new_player_id.includes(element[6])) {
                element_player = {
                    _id: server + '_' + element[6],
                    Uid: element[6],
                    Un: element[7].substring(1, element[7].length - 1),
                    Aid: element[8],
                    An: element[9].substring(1, element[9].length - 1),
                    Vivi: [element[4]]
                }

                // console.log("aaa")
                array_new_player.push(element_player);
                array_new_player_id.push(element[6]);
            } else {
                // console.log("add vivi")
                let index_of = array_new_player.findIndex(player => player.Uid == parseInt(element[6]));
                // console.log(index_of);
                // console.log(array_new_player[index_of]);
                array_new_player[index_of].Vivi.push(element[4]);
            }


        };

        if (option == 3 || option == 4) {
            build_ally(element, array_new_ally, array_new_ally_id);
        }

        function build_ally(element, array_new_ally, array_new_ally_id) {

            if (element[8] == 0) {
                return
            }
            let element_ally;

            if (!array_new_ally_id.includes(element[8])) {
                // console.log("new ally")
                element_ally = {
                    _id: server + '_' + element[8],
                    Aid: element[8],
                    An: element[9].substring(1, element[9].length - 1),
                    Player: [element[6]]
                }
                array_new_ally.push(element_ally);
                array_new_ally_id.push(element[8]);
            } else {
                // console.log("add player")

                // console.log();
                let index_of = array_new_ally.findIndex(ally => ally._id == parseInt(element[8]))
                // console.log(index_of);
                // console.log(array_new_ally[index_of]);
                if (index_of < 0) {
                    // console.log(element);
                    // console.log(index_of);
                    // console.log(element[8])
                    return
                }
                array_new_ally[index_of].Player.push(element[6])
                // uniq = [...new Set(array)];
                array_new_ally[index_of].Player = [... new Set(array_new_ally[index_of].Player)];

            }
        }


    });

    if (option == 2 || option == 4) {

        // console.log(array_new_player_id);
        console.log(array_new_player);
        
        let url_api;
        // url_api = "http://localhost:3000/sql/data/player/s2";
        // url_api = url + "/sql/data/player/s2";
        url_api = url + "/api/server/" + server + "/sql/player";

        array_new_player.forEach(element => {

            postData_SQL(url_api, element);

            updateDATA_SQL(url_api, element);
        });
    }

    if (option == 3 || option == 4) {

        // console.log(array_new_ally_id);
        // console.log(array_new_ally);

        let url_api;
        // url_api = "http://localhost:3000/sql/data/ally/s2";
        // url_api = url + "/sql/data/ally/s2";
        url_api = url + "/api/server/" + server + "/sql/ally";

        array_new_ally.forEach(element => {

            postData_SQL(url_api, element);

            updateDATA_SQL(url_api, element);
        });
    }

    console.log("end")

};
//GET 
async function getData_new_SQL(server) {
    let url_SQL;

    // url_SQL = "https://test-trav.herokuapp.com/sql/travian/s2";
    // url_SQL = "http://localhost:3000/sql/travian/s2";

    // url_SQL = url + "/sql/travian/s2";
    url_SQL = url + "/api/server/" + server + "/sql";

    const response = await fetch(url_SQL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',

    });
    // console.log(response);
    // console.log(response.json());
    return response.text();
};

async function getData_old_SQL(type, server) {
    let url_SQL;
    url_SQL = url + "/api/server/" + server + "/" + type;

    const response = await fetch(url_SQL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    return response.json();
};
//POST DATA
async function postData_SQL(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // console.log("data_saved")
    return response.json(); // parses JSON response into native JavaScript objects
};
// PUT DATA
async function updateDATA_SQL(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // console.log("data_changed")
    return response.json(); // parses JSON response into native JavaScript objects
};

//DATA TEST CHOICE
async function clean_sql_de_travian(server) {
    let DATA_FROM_TG = await getData_new_SQL(server);
    // let DATA_FROM_TG = DATA_TEST_TG;

    DATA_FROM_TG = ");" + DATA_FROM_TG.replace(/\r|\n/g, '').replace(/\); INSERT INTO `x_world` VALUES \(/g, '\);INSERT INTO `x_world` VALUES \(');

    let DATA_FROM_TG_ARRAY = DATA_FROM_TG.split(');INSERT INTO `x_world` VALUES (');
    DATA_FROM_TG_ARRAY[0] = DATA_FROM_TG_ARRAY[0].substring(34);

    let aaa = DATA_FROM_TG_ARRAY.shift();

    let testYY;

    testYY = DATA_FROM_TG_ARRAY;

    return testYY;
};
