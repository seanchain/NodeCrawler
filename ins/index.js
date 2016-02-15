var request = require('sync-request')
var proc = require('child_process')

user = 'jessica.syj'
url = 'https://www.instagram.com/' + user
rex = /"display_src":"(https:[^">]+\.jpg)/g
rex1 = /e,"id":"([^">]+)"/g

function getNewURL(html) {
	var count = 0
	var newurl = 'https://www.instagram.com/' + user + '/?max_id='
	while(n = rex1.exec(html)) {
		count ++
		if (count == 24) {
			newurl = newurl + n[1]
		}
	}
	url = newurl
}

function retrievePictures() {
	var response = request('GET', url)
	var html = response.getBody()
	while (m = rex.exec(html)) {
		proc.execSync('wget -nc ' + m[1] + ' -P ' + './images')
	}
	getNewURL(html)
}

for (var i = 0; i < 5; i ++) {
	retrievePictures()
}
