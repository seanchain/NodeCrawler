var fs = require('fs')
var proc = require('child_process')
var request = require('sync-request')

glob_counter = 1
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };


function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
  })
}


function getImage(content) {
  if (content != undefined && content != '' && content != null) {
    var m, rex = /<img[^>]+src="(http:[^">]+\.jpg)"/g
    while ( m = rex.exec( content ) ) {
      var picurl = m[1]
      if (picurl.contains('media.tumblr.com')) {
        proc.execSync('wget -nc ' + picurl + ' -P ' + './images')
      }
    }
  }
}

function getVideo(content) {
  if (content != undefined && content != '' && content != null) {
    var m, rex = /<iframe[^>]+src='(http[^">]+\/)'/g
    while (m = rex.exec(content)) {
      if (m[1] != null && m[1] != undefined && m[1] != '' && m[1].contains('/video/')) {
      var f_videolink = m[1]
      var resp = request('GET', f_videolink)
      var html = resp.getBody()
      reg = /<source[^>]+src="(http[^">]+)"/
      res = reg.exec(html)
        if (res[1] != null && res[1] != undefined && res[1] != '') {
          var v_link = res[1]
          var videotitle = './videos/tumblr_'+ glob_counter +'.mp4'
          glob_counter += 1
          proc.execSync('wget -nc ' + v_link + ' -O ' + videotitle)
        }
      }
    }
  }
}

oriurl = 'http://princesst-ara.tumblr.com/page/'

for (var i = 0; i < 3; i ++) {
  url = oriurl + new String(i + 1)
  console.log('valid url: ' + url)
  var response = request('GET', url)
  var content = response.getBody()

  getImage(content)
  getVideo(content)
}
