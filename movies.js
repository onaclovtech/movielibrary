   var app = angular.module("myapp", ["firebase", "video"])
       .controller('MyController', ['$scope', '$video', '$firebase',
           function($scope, $video, $firebase) {
               var FB = "";
               var api_key = "";
               var ref = new Firebase(FB);
               $scope.movies = $firebase(ref);
               $scope.edit = false;
               $scope.details = [false, false, false, false, false];
               var resetDetails = function() {
                   $scope.details[0] = false;
                   $scope.details[1] = false;
                   $scope.details[2] = false;
                   $scope.details[3] = false;
                   $scope.details[4] = false;
               }
               $scope.selectDVD = function(index) {
                   $scope.title = $scope.data["movies"][index]["title"];
                   $scope.thumbnail = $scope.data["movies"][index]["posters"]["thumbnail"].replace("_tmb", "_det");
                   $scope.rating = $scope.data["movies"][index]["ratings"]["critics_rating"];
                   $scope.filename = $scope.data["movies"][index]["title"].replace(/ /g, ".") + '.m4v';
               };
               $scope.findDvd = function(e) {
                   var response = $video.search(api_key, $scope.dvd, '5');
                   response
                       .success(function(data, status) {
                           console.log('SUCCESS' + data);
                           $scope.data = data;

                           $scope.status = status;
                       })
                       .error(function(data, status) {
                           console.log('ERROR' + status);
                           $scope.data = data;
                           $scope.status = status;
                       });
               }
               $scope.clearResults = function(e) {
                   $scope.dvd = "";
                   $scope.data = "";
                   $scope.filename = "";
                   resetDetails();
               }
               $scope.editFilename = function(e) {
                   $scope.edit = !$scope.edit;
               }

               $scope.showDetails = function(e) {
                   $scope.details[e] = !$scope.details[e];
               }

               $scope.addDvd = function(e) {
                   if ($scope.filename != "") {
                       $scope.movies.$add({
                           "title": $scope.title,
                           "filename": $scope.filename,
                           "thumbnail": $scope.thumbnail,
                           "rating": $scope.rating
                       });
                       $scope.data = null;
                       $scope.filename = "";
                       $scope.dvd = "";
                       resetDetails();
                   }
               }

           }
       ]);
   app.config(function($httpProvider) {
       //Enable cross domain calls
       $httpProvider.defaults.useXDomain = true;
       delete $httpProvider.defaults.headers.common['X-Requested-With'];
       $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
   });
