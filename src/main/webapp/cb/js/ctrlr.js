var cbMod = angular.module('cbMod',['myUtilModule']);

function GameController($scope, $log) {
  $scope.log = "log msg";
  $s = $scope;
  
  $scope.ns = new NumberService();
  
  /*
  $log.log = function(msg) {
    $scope.log = msg;
  }
  */
  
  $s.n = $s.ns.getRandom(4);
  $s.g = "";
  $s.g1 = "";
  $s.gca = [];
  $s.ga = [new V(""), new V(""), new V(""), new V("")];
  $s.fa = [new V(false), new V(false), new V(false), new V(false)];
  
  $s.newGame = function() {
    $s.gca = [];
    $s.n = $s.ns.getRandom(4);  
  }
  
  $s.try = function() {
    var ng = $s.g.split("");
    if (ng.length == $s.n.length) {
      $log.log("good try" + $s.g);
      var c = $s.ns.match($s.n, ng); 
      var gc = new GC(ng, c);
      $s.gca.push(gc);
      $s.g = "";
    }
  }

  $s.g1f = false;
    
  $s.try2 = function() {
    var g1 = $s.g1;
    if (g1.length > 1) {
      g1 = g1.substr(g1.length - 1, g1.length);
      $s.g1 = g1;
    }
    $log.log("g1 " + g1 + " " + g1.length );
  }
  
  $s.counter = 0;
  
  $s.chg2 = function(evt, f) {
    $log.log ("chg " + $s.counter++);
    f();
  }

  $s.change = function (idx) {
    for (var i = 0; i < $s.fa.length; i++) {
      $s.fa[i].v = false;
    }
    if ((idx + 1) < $s.fa.length) {
      $s.fa[idx + 1].v = true;
    }
    var g1 = $s.ga[idx].v;
    if (g1.length > 1) {
      g1 = g1.substr(g1.length - 1, g1.length);
      $s.ga[idx].v = g1;
    }
  }

  $s.win = function () {
	if ($s.gca.length > 0) {
		if ($s.gca[$s.gca.length - 1].call.b == $s.n.length) {
			return true;
		}
	}
	return false;
  }
  
  $log.log("log test " + $scope.ns.getRandom());
}

function NumberService() {
  
}

NumberService.prototype.getDigits = function () {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] ;
}

NumberService.prototype.getRandom = function (n, da) {
  n = 4;
  da = this.getDigits();
  idarr = [] ;
  for (var i = 0; i < da.length; i++) {
    idarr.push(i);
  }
  num = [];
  for (var i = 0; i < n; i++) {
    var idx = Math.floor(Math.random() * idarr.length);
    num.push(da[idarr[idx]]);
    idarr.splice(idx, 1);
  }
  return num;
}

NumberService.prototype.match = function (num, guess) {
  var call = {} ;
  call.b = 0;
  call.c = 0;
  var p = []; 
  for (var i = 0; i < num.length; i++) {
    p.push(false);
  }
  for (var i = 0; i < num.length; i++) {
    if (num[i] == guess[i]) {
      call.b++;
      p[i] = true;
    }
  }
  for (var i = 0; i < num.length; i++) {
    if (!p[i]) {
      for (var j = 0; j < guess.length; j++) {
        if (num[i] == guess[j] && i != j) {
          call.c++;
        }
      }
    }
  } 
  return call;
}

function GC (g, c) {
  this.guess = g;
  this.call = c;
} 

function V(val) {
	this.v = val;
}
