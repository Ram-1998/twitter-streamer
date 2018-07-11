(function (){
var app = angular.module('myApplication',[]);
app.controller('mycntrl',tweeterctrl);
tweeterctrl.$inject = ['$scope','$http']

function tweeterctrl($scope,$http){


  //$scope.text = "hello friends !!! chai Pi lo !!";
  $scope.searchTweets = function(){
  
           // use $.param jQuery function to serialize data from JSON
           $scope.tweets = []; 
            var data = {
                text : $scope.text,
                userName : $scope.userName,
                screenName : $scope.screenName,
                retweetCount : $scope.retweetCount,
                UserfollowerCount : $scope.UserfollowerCount,
                favrioteCount : $scope.favrioteCount,
                userMention : $scope.userMention,
                startDate : $scope.startDate,
                endDate : $scope.endDate,
                language : $scope.language,
            };

            var post = $http({
              method:"POST",
              url: "/filter",
              data : data,
              headers : { "Content-Type": "application/json" , 
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers':'X-Requested-With' }
           }).then(function(resp){
              console.log(resp.data);
             $scope.tweets = resp.data;
           });
           // $('#PaginateTweets').easyPaginate({
           //      paginateElement: 'li',
           //      elementsPerPage: 10,
           //      effect: 'climb'
           //    }); 
       

  };

}
})();