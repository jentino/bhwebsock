/* eslint no-alert: 0 */

'use strict';

//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'ui.knob',
  'ngWebSocket',
  'mobile-angular-ui',
  'angular.directives-round-progress',
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'.
  // This is intended to provide a flexible, integrated and and
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

app.run(function($transform) {
  window.$transform = $transform;
});

//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'https://serene-depths-49662.herokuapp.com/login.html', reloadOnSearch: false}).when('/home', {templateUrl: 'https://serene-depths-49662.herokuapp.com/home.html', reloadOnSearch: false});
  $routeProvider.when('/account', {templateUrl: 'https://serene-depths-49662.herokuapp.com/account.html', reloadOnSearch: false}).when('/login', {templateUrl: 'https://serene-depths-49662.herokuapp.com/login.html', reloadOnSearch: false}).when('/cancel', {templateUrl: 'https://serene-depths-49662.herokuapp.com/cancel.html', reloadOnSearch: false}).when('/success', {templateUrl: 'https://serene-depths-49662.herokuapp.com/success.html', reloadOnSearch: false}).when('/trades', {templateUrl: 'https://serene-depths-49662.herokuapp.com/trades.html', reloadOnSearch: false}).otherwise({templateUrl: 'https://serene-depths-49662.herokuapp.com/login.html'});
  
});

//
// `$touch example`
//

app.directive('toucharea', ['$touch', function($touch) {
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.containerRect = elem[0].getBoundingClientRect();
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem) {
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if (drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function() {
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() {
                scope.$apply(function() {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

// //
// // Another `$drag` usage example: this is how you could create
// // a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
// //
app.directive('carousel', function() {
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function() {
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 


app.factory('MyData', function($websocket){
  
    var dataStream = $websocket('ws://127.0.0.1:1337');
  
    var collection = [];

    var thebalance = [];
  
    dataStream.onMessage(function(message) {
      var data = JSON.parse(message.data);
      if(data.type === 'timer'){
        collection.push(JSON.parse(message.data));
      }
      else if(data.type === 'bobalanceupdate'){
        console.log(message.data); 
        thebalance[0] = (JSON.parse(message.data));
      }
               

    });
  
    var methods = {
      collection: collection,
      thebalance: thebalance,
      getBalance: function() {
        dataStream.send(JSON.stringify({ action: 'getBalance' })); // json call to local receiver to query binary.com
      },
      connectToBinary: function() {
        dataStream.send(JSON.stringify({ action: 'connectToBinary' })); // json call to local receiver to query binary.com
      },
      startServerClock: function() {
        dataStream.send(JSON.stringify({ action: 'startServerClock' }));
      }
    };
  
    return methods;
  
  });

//***********************                   MainController             **************************************/ 
/************************                   MainController             **************************************/
/************************                   MainController             **************************************/
/*************************                   MainController             **************************************/

app.controller('MainController', function($rootScope, $scope, $http, $location, $timeout, MyData) {
  
  var countie = 0;
  var isConnected = false;
  
  
  function startInternalClock(){
    
    $scope.ter = -2;
    
    $scope.timer4 = setInterval(function(){
      $scope.ter++;
      $scope.$apply();
      $scope.MySecs =  MyData.collection[$scope.ter];
      $scope.MyBalance =  MyData.thebalance[0];
      //console.log($scope.ter);
    }, 1000);  
  }

  function bo_checkbalance() {
    
    MyData.getBalance();
    //$scope.MyBalance = MyData.thebalance;
    
  }

  function bo_connect() {
    
    MyData.connectToBinary();
    //$scope.MyBalance = MyData.thebalance;
    
  }
    
  

  function startheatbeat(){
    
    $scope.countDownsec = 0;   
    $scope.countDownmin = 0;
    $scope.countDownhrs = 0;

    $scope.timer1 = setInterval(function(){
      if(isConnected){
        $scope.countDownsec++;
        $scope.updateProfitBar();
        $scope.updatebalancedb();
        $scope.$apply();
        if($scope.countDownsec == 59) {
          $scope.countDownmin++;
          $scope.countDownmin = $scope.countDownmin%60;
          if($scope.countDownmin == 59){
            $scope.countDownhrs++;
            $scope.countDownhrs = $scope.countDownhrs%24;
          }
          $scope.countDownsec = 0;
        }
        
      }
    }, 1000);  
  }

  function stopConnectTimer1() {
    clearInterval($scope.timer1);
  }

  function stopDisconnectTimer2() {
    clearInterval($scope.timer2);
  }


  $scope.value = 0;
  $scope.profittarget = 0;
  $scope.options = {
    unit: "%",
    readOnly: true,
    subText: {
      enabled: true,
      text: 'Profit',
      color: 'gray',
      font: 'auto'
    },
    trackWidth: 30,
    barWidth: 15,
    trackColor: '#C7DDF7',
    barColor: 'lime'
  };
  

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

   
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  $scope.updateidx = function(varvalue){


    // if(varvalue =="Profit")
    // else if(varvalue =="Credits")
    //   $scope.lorem = "Credits 4";
    
  }
  
  // Fake text i used here and there.
  $scope.lorem = 'Welcome. Click connect to start trading.';

  $scope.connectdisplay = "Connect";

  $scope.disconnectdisplay = "Disconnected";
  
  //'Scroll' screen
  
  var scrollItems = [];

  for (var i = 1; i <= 100; i++) {
    scrollItems.push('Item ' + i);
  }
  
  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  };

  //
  // Right Sidebar
  //
  $scope.chatUsers = [
    {name: 'Jenty Mepa', online: true},
    {name: 'Carline Pienaar', online: false},
    {name: 'Jana  Terry', online: false},
    {name: 'Ebony Rice', online: false}
  ];
  $scope.rememberMe = false;

  $scope.pbarvalues;

 
  
  $scope.updateProfitBar = function() {
    if(isConnected){
      $http({
        
        method: 'GET',
        url: 'https://serene-depths-49662.herokuapp.com/api/getpbar.php'
        
        }).then(function (response) {
            
            $scope.pbarvalues = response.data;
            var tempbar = $scope.pbarvalues[0].circlebar;
            if(tempbar < 0 ){
              $scope.value = 0;
              $scope.profittarget = 0;
            }else {
              $scope.value = tempbar;
              $scope.profittarget = (($scope.value/100 * 10).toFixed(2))*10;
            }

            if($scope.value >=100){
              
              
              stopConnectTimer1();
              if(!isConnected){
                $scope.lorem = "Disconnected.";
              }
                
              if(isConnected){
                $scope.lorem = "CONGRATULATIONS! Target reached.";
                $scope.connectdisplay = "Connect";
                $scope.disconnectdisplay = "Disconnected";
              }
            }
        }, function (response) {        
            // on error
            console.log(response.data,response.status);
            
        });
    }else {
      $scope.value = 0;
    }
  };

  $scope.updatebalance;

  $scope.updatebalancedb = function () {
        $http({
            
            method: 'GET',
            url: 'https://serene-depths-49662.herokuapp.com/api/getbalance.php'
            
        }).then(function (response) {
            
            $scope.updatebalance = response.data;
    
        }, function (response) {        
            // on error
            console.log(response.data,response.status);
            
        });
    };

  $scope.getConnected = function() {
    isConnected = true;
    $scope.connectdisplay = "Connected";
    $scope.disconnectdisplay = "Disconnect";
    $scope.lorem = 'Connected. Trading in progress...';   
    //startheatbeat();
    
    startInternalClock();
    MyData.startServerClock();
 };

 
$scope.getDisconnected = function() {
  
  isConnected = false;
  $scope.countDownsec = 0;   
  $scope.countDownmin = 0;
  $scope.countDownhrs = 0;
  clearInterval($scope.timer1);
  $scope.value = 0;
  $scope.updatebalance = 0;
  $scope.connectdisplay = "Connect";
  $scope.disconnectdisplay = "Disconnected";
  $scope.lorem = 'Disconnected';   

};

$scope.roundProgressData = {
  label:  0,
  percentage: 100
};

$scope.login = function() {
  
  $location.path('/home');
  //bo_checkbalance();
  bo_connect();
  
  
  // $http({
  //     url:  'https://serene-depths-49662.herokuapp.com/api/validatelogin.php',
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/x-www-urlencoded'
  //     },
  //     data: 'username='+Username+'&password='+Password
  // }).then(function(response){
  //   console.log(response.data);
  //    $location.path('/home');
  // })

  
};
  //
  // 'Drag' screen
  //
  $scope.notices = [];


  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1)});
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});

