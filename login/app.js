var ajaxExample = angular.module('ajaxExample', []);

ajaxExample.controller('mainController',function($scope,$http){
    $scope.people;

    $scope.getPeople = function() {
          $http({
              
              method: 'GET',
              url: 'http://10.0.0.5/mobile/api/get.php'
              
          }).then(function (response) {
              
              // on success
              $scope.people = response.data;
              
          }, function (response) {
              
              // on error
              console.log(response.data,response.status);
              
          });
    };

    $scope.addPerson = function() {
          $http({
              
               method: 'POST',
               url:  'http://10.0.0.5/mobile/api/post.php',
               data: {newName: $scope.newName, newPhone: $scope.newPhone }
               
          }).then(function (response) {// on success
            
               $scope.getPeople();
            
          }, function (response) {
              
               console.log(response.data,response.status);
               
          });
    };

    $scope.deletePerson = function( id ) {

          $http({
              
              method: 'POST',
              url:  'http://10.0.0.5/mobile/api/delete.php',
              data: { recordId : id }
              
          }).then(function (response) {
        
              $scope.getPeople();
        
          }, function (response) {
              
              console.log(response.data,response.status);
              
          });
        };

        $scope.getPeople();
});