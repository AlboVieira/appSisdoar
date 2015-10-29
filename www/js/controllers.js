function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}

angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state, LoginService) {
  $scope.data = {};

  $scope.login = function() {
    var data = {'email':$scope.data.username, 'pass':$scope.data.password};
    LoginService.login('post','http://sisdo-web/token/login', data);
  }
})


//menu lateral
.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {
      $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
      }
})

.controller('InstituicaoCtrl', function($scope,$stateParams, $ionicSideMenuDelegate) {


        $scope.getInstituicaoById = function () {
            var data = $stateParams;
            $http({
                method: 'GET',
                url:  'http://sisdo-web/institution-api/get-institutions',
                data: data
            });

        }
         /*   .error(function(data) {
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

            });*/
})

.controller('DashCtrl', function($scope,$http,$state,$ionicSideMenuDelegate) {

      $http.post('http://sisdo-web/institution-api/get-institutions').then(function(instituicao) {
        console.log(instituicao.data);
        $scope.instituicoes = instituicao.data;
      },
      function(err) {
        console.error('ERR', err);
      });

      $scope.limpaAuto = function () {
         $scope.completing = false;
      },
      
      $scope.pesquisar = function(pesquisa){

        // Se a pesquisa for vazia
        if (pesquisa == ""){

          // Retira o autocomplete
          $scope.completing = false;

        }else{
          // Pesquisa no banco via AJAX
          $http.post('http://sisdo-web/institution-api/get-instituction-auto-complete', { "term" : pesquisa}).
              success(function(data) {
                console.log(data);
                // Coloca o autocomplemento
                $scope.completing = true;

                // JSON retornado do banco
                $scope.dicas = data;
              })
              .error(function(data) {
                // Se deu algum erro, mostro no log do console
                console.log("Ocorreu um erro no banco de dados ao trazer auto-ajuda da home");
              });
        }
      };

})

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

