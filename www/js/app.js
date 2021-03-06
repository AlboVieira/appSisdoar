// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var serialize = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
          serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
};

angular.module('starter', ['ionic','starter.controllers', 'starter.services', 'ngCordova','ion-autocomplete'])

.run(function($ionicPlatform,$rootScope,$ionicLoading,$cordovaPush) {

        var androidConfig = {
            "senderID": "26827c56fc4cc47589fe3b43148b663d7d2c730f714a80d2"
        };

        /*
        $cordovaPush.register(androidConfig).then(function(result) {
            console.log(androidConfig);
            console.log(result);
        }, function(err) {
            console.log(err);
            // Error
        }); */


        $ionicPlatform.ready(function() {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
    });

    //mostra mensagem no loading ajax
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: 'Aguarde, Carregando.'})
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });

        /*
    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch(notification.event) {
            case 'registered':
                if (notification.regid.length > 0 ) {
                    alert('registration ID = ' + notification.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                break;

            case 'error':
                alert('GCM error = ' + notification.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    });*/
})

//configura para envio de requisicao
.config(function ($httpProvider) {
    //intercepta chamada ajax para colocar um loading
    $httpProvider.interceptors.push(function($rootScope) {
        return {
            request: function(config) {
                if(config.global === undefined)
                    $rootScope.$broadcast('loading:show');

                return config;
            },
            response: function(response) {
                $rootScope.$broadcast('loading:hide');
                return response;
            }
        }
    });

    ////configura para envio de requisicao ao php
    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
          return data;
        }
        return serialize(data);
    };

  // set all post requests content type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
})

.config(function($stateProvider, $urlRouterProvider) {

   // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      //login
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html',
          controller: 'TabsCtrl'
      })

    .state('instituicao', {
      url: '/instituicao/:id',
      templateUrl: 'templates/instituicao.html',
      controller: 'InstituicaoCtrl'
    })

    .state('tab.minhastransacoes', {
      url: '/minhas-transacoes',
      views: {
          'tab-account': {
              templateUrl: 'templates/tab-minhas-transacoes.html',
              controller: 'MinhasTransacoesCtrl'
          }
      }
    })

    .state('donativos', {
      url: '/donativos/:id',
      templateUrl: 'templates/donativos.html',
      controller: 'DonativosCtrl'
    })
    .state('donativo', {
        url: '/donativo/:id',
        templateUrl: 'templates/donativo.html',
        controller: 'DonativoCtrl'
    })
    .state('transacao', {
      url: '/transacao/:id',
      templateUrl: 'templates/transacao.html',
      controller: 'TransacaoCtrl'
    })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.minhas-transacoes', {
      url: '/minhastransacoes',
      views: {
        'tab-minhas-transacoes': {
          templateUrl: 'templates/tab-minhas-transacoes.html',
          controller: 'MinhasTransacoesCtrl'
        }
      }
    })

  .state('mensagens', {
      templateUrl: 'templates/mensagens.html',
          controller: 'MensagensCtrl',
          url: '/mensagens/:id'
      })


    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
