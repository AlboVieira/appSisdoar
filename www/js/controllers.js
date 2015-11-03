function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}

angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, $ionicPopup,$localstorage, $state, LoginService) {
   $scope.data = {};

    if($localstorage.getObject('user').id){
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

.controller('DonativoCtrl', function($scope,$stateParams,$http,$ionicPopup,$location, $localstorage) {

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
    };
    $scope.getDonativo = function () {
        return this.donativo;
    };
    $scope.submit = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmacao Transacao',
            template: 'Deseja iniciar uma nova transacao?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                //estou inserindo o usuario manualmente por enquanto
                var transaction = {'personUser':$localstorage.getObject('user').id,'institutionUser':$scope.getDonativo().institutionUser, 'product': $scope.getDonativo().idProduto, 'shippingMethod': $scope.metodo, 'quantify': $scope.qtd};
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
.controller('MinhasTransacoesCtrl', function($scope,$http,$ionicLoading,$location,$localstorage, $ionicSideMenuDelegate) {
        $scope.openMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        var transacoes = {};

        $http({
            method: 'GET',
            url:  'http://sisdo-web/transaction-api/get-transactions-user?id='+ $localstorage.getObject('user').id
        }).success(function(data) {
            console.log(data);
            $scope.setTransacao(data);
            return $scope.transacoes = data;
        });

        $scope.setTransacao = function (data) {
            this.transacoes = data;
        };
        $scope.getTransacao = function () {
            return this.transacoes;
        };
        $scope.go = function ( path ) {
            $location.path( path );
        };
})
.controller('TransacaoCtrl', function($scope,$stateParams,$http,$location,$ionicPopup, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
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
    };
    $scope.getTransacao = function () {
        return this.transacao;
    };
    $scope.go = function ( path ) {
        $location.path( path );
    };
})
.controller('MensagensCtrl', function($scope,$stateParams,$http,$location,$localstorage,$ionicPopup, $ionicSideMenuDelegate) {

  //  $scope.openMenu = function () {
  //      $ionicSideMenuDelegate.toggleLeft();
   // };

   //pega mensagens a partir do id da transacao
    var mensagens = {};
    $http({
        method: 'GET',
        url:  'http://sisdo-web/transaction-api/get-mensagens',
        params: $stateParams
    }).success(function(data) {
        console.log(data);
        $scope.setMensagens(data);
        return $scope.mensagens = data;
    });

    $scope.setMensagens = function (data) {
        this.mensagens = data;
    };
    $scope.getMensagens = function () {
        return this.mensagens;
    };
    $scope.getClass = function (isInstituicao) {
        return isInstituicao ? 'item-avatar-right item-stable' : 'item-avatar-left';
    };
    $scope.submit = function () {

        console.log($localstorage.getObject('user').id);
        console.log($scope.msg);
        console.log($stateParams.id);
        var mensagem = {'idTransacao':$stateParams.id, 'idUser': $localstorage.getObject('user').id,'message':$scope.msg};
        console.log(mensagem);
        $http({
            method: 'POST',
            url:  'http://sisdo-web/transaction-api/new-message',
            data: mensagem
        }).success(function(data) {
            console.log(data);
            //$scope.setMensagens(data);
            //return $scope.mensagens = data;
        });
    };
    $scope.go = function ( path ) {
        $location.path( path );
    };
})

.controller('DashCtrl', function($scope,$http,$state,$localstorage,$location,$ionicSideMenuDelegate) {

      $scope.go = function ( path ) {
           $location.path( path );
      };
      $http.get('http://sisdo-web/institution-api/get-institutions').then(function(instituicao) {
        console.log(instituicao.data);
        $scope.instituicoes = instituicao.data;
      },
      function(err) {
        console.error('ERR', err);
      });

      $scope.limpaAuto = function () {
         $scope.completing = false;
      };

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

