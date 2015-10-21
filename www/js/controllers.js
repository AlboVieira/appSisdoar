function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}

angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function() {

    var data = {'email':$scope.data.username, 'pass':$scope.data.password};
    $http({
      method: 'POST',
      url: 'http://sisdo-web/token/login',
      data: data
      })
      .error(function(data) {
          var alertPopup = $ionicPopup.alert({
            title: 'Falha ao Autenticar!',
            template: 'Por favor, cheque suas credenciais!'
          })})
      .success(function(data) {
          console.log(data);
          if(data.token == 'identificado'){
            $state.go('tab.dash');
          }else{
            var alertPopup = $ionicPopup.alert({
              title: 'Falha ao Autenticar!',
              template: 'Por favor, cheque suas credenciais!'
            });
          }

      });


      /*
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        $state.go('tab.dash');
      }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Falha ao Autenticar!',
          template: 'Por favor, cheque suas credenciais!'
        });
      }); */
  }
})
  /*
.controller('MainCtrl', function($scope, $http) {
  $http.post('http://sisdo-web/usuario/getTestes').then(function(resp) {
    console.log(resp.data.teste);
    $scope.conditions = resp.data.teste;
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
})
*/

//menu lateral
.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {
      $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
      }
})

.controller('DashCtrl', function($scope,$ionicSideMenuDelegate) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

