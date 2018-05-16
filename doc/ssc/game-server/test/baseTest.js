/**
 * Created by linyng on 2017/6/24.
 */



function test() {
    let list = [1,2,3,4,5,6];
    let skip = 6;
    let limit = 3;
    console.log(list.slice(skip, skip + limit));

    return;
    this.aaaa = 100;
    let arr = [1,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6,3,4,5,6];
    arr.map(function (item) {
        console.info('map item:',item, this.aaaa);
    });
    console.info('````````````end');


    let players ={};
    players[12] = 100;
    players[13] = 101;
    players[14] = 102;
    players[15] = 103;
    for (let key in players){
        console.info('````````````',key, players[key] );
    }
}

test();