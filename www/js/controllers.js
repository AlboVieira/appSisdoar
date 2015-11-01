function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}

angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, $ionicPopup,$localstorage, $state, LoginService) {
   $scope.data = {};

    var user = $localstorage.getObject('user');
    if(user){
        $state.go('tab.dash');
    }
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

.controller('InstituicaoCtrl', function($scope,$stateParams,$http,$location,$ionicSideMenuDelegate) {

    $http({
        method: 'GET',
        url:  'http://sisdo-web/institution-api/get-institution',
        params: $stateParams
    }).success(function(data) {
        console.log(data);
        return $scope.instituicao = data;
    });

    $scope.go = function ( path ) {
        $location.path( path );
    };
})

.controller('DonativosCtrl', function($scope,$stateParams,$http,$location, $ionicSideMenuDelegate) {
    $http({
        method: 'GET',
        url:  'http://sisdo-web/product-api/get-donations-by-institution',
        params: $stateParams
    }).success(function(data) {
        console.log(data);
        return $scope.donativos = data;
    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

})

.controller('DonativoCtrl', function($scope,$stateParams,$http,$ionicPopup,$location, $localstorage,$ionicSideMenuDelegate) {

    var donativo = {};
    $http({
        method: 'GET',
        url:  'http://sisdo-web/product-api/get-donation',
        params: $stateParams
    }).success(function(data) {
        $scope.setDonativo(data);
        return $scope.donativo = data;
    });

    $scope.setDonativo = function (data) {
        this.donativo = data;
    },
    $scope.getDonativo = function () {
        return this.donativo;
    },
    $scope.submit = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmacao Transacao',
            template: 'Deseja iniciar uma nova transacao?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                //estou inserindo o usuario manualmente por enquanto
                var transaction = {'personUser':$localstorage.get('user').id,'institutionUser':$scope.getDonativo().institutionUser, 'product': $scope.getDonativo().idProduto, 'shippingMethod': $scope.metodo, 'quantify': $scope.qtd};
                console.log(transaction);
                $http({
                    method: 'POST',
                    url:  'http://sisdo-web/transaction-api/new-transaction',
                    data: transaction
                }).success(function(data) {
                    console.log(data);
                    if(data.id != undefined){
                        $location.path('/transacao/'+data.id);
                    }else{
                        console.log('Houve algum erro');
                    }
                }).error(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Erro',
                        template: 'Erro ao Salvar'
                    })
                });
            }
        });

    }

})
.controller('TransacaoCtrl', function($scope,$stateParams,$http,$location, $ionicSideMenuDelegate) {
        var transacao = {};
        $http({
            method: 'GET',
            url:  'http://sisdo-web/transaction-api/get-transaction',
            params: $stateParams
        }).success(function(data) {
            console.log(data);
            $scope.setTransacao(data);
            return $scope.transacao = data;
        });

        $scope.setTransacao = function (data) {
            this.transacao = data;
        },
        $scope.getTransacao = function () {
            return this.transacao;
        }


})

.controller('DashCtrl', function($scope,$http,$state,$location,$ionicSideMenuDelegate) {

      $scope.go = function ( path ) {
           $location.path( path );
      },
      $http.get('http://sisdo-web/institution-api/get-institutions').then(function(instituicao) {
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
          $http.get('http://sisdo-web/institution-api/get-instituction-auto-complete', { "term" : pesquisa}).
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

