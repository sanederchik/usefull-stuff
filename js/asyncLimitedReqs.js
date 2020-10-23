var o = JSON.parse(document.body.getAttribute('data-bem'))
var key = o["i-global"].jsParams["i-api-request"]['skv2']

var args = [
    {"offset":1,
    "limit":99999,
    "date1":"2020-01-01",
    "date2":"2020-10-22",
    "currency":"",
    "id":"", //fill
    "accuracy":1}
]


var a = await fetch("https://metrika.yandex.ru/i-proxy/i-users-data-api/getList?lang=ru", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": 'args=' + JSON.stringify(args) + '&key=' + key + '&lang=ru',
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})

var r1 = await a.json();

//iMax - max number of reqs for server at the moment
//iStart - start of iterator
//iFinish - finish of iterator


var res = {}
var iMax = 50
var iStart = 0

var getInfo = async(x, _) => {
    
    return new Promise(function(resolve, reject) {

        var r2
        console.log(`Ordering part ${_}`)
        o = [
                {
                "id": args[0]["id"],
                "userIDHash": x['dimensions'][0]['name'],
                "userIDHash64": x['dimensions'][1]['name'],
                "first_visit_date": x['dimensions'][7]['name']
                }
            ]


        a = fetch("https://metrika.yandex.ru/i-proxy/i-users-data-api/getInfo?lang=ru", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": 'args=' + JSON.stringify(o) + '&key=' + key + '&lang=ru',
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })
        .then( x1 => x1.json() )
        .then( x2 => {
            res[_] = x2
            console.log(`Part ${_} done`)
            resolve()
        }
        )


    })

}

var iFinish = await r1["result"]["data"].length

while(iFinish > iStart){
	
	var promises = [];
    var l = await Math.min(iMax + iStart, iFinish)
	for(i=iStart; i<l; i++){
		promises.push(getInfo(r1['result']['data'][i], i));
	}
	
	//start
	
	var p = await Promise.all(promises)
	iStart = await l
	
}
