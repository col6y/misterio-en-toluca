'use strict';

// declare app level module which depends on filters, and services
var app = angular.module('misterio', [
  'ngRoute',
  'misterio.filters',
  'misterio.services',
  'misterio.directives',
  'misterio.controllers'
]);

app.config(['$routeProvider', function($routeProvider) {
  function r(path, template, controller) {
    $routeProvider.when(path, {
      templateUrl: template ? ('partials/' + template + '.html') : undefined,
      controller: controller || undefined
    });
  }

  r('/', 'feed', 'Feed');
  r('/inbox', 'feed', 'Inbox');
  r('/compose', 'compose', 'Compose');
  r('/compose/:id', 'compose', 'Compose');
  r('/broadcast', 'broadcast', 'Broadcast');
  r('/users', 'users', 'Users');
  r('/users/add', 'add-user', 'AddUser');
  r('/users/:cid', 'feed', 'Profile');

  $routeProvider.otherwise({
    templateUrl: 'partials/not-found.html'
  });
}]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

app.run(function($rootScope, $location, User) {
  $rootScope.city = "Toluca";

  $rootScope.inboxCount = 0;

  $rootScope.page = {
    title: 'Un Misterio en ' + $rootScope.city,
    fullTitle: function() {
      var ctx = $rootScope.page.context;
      return $rootScope.page.title + (ctx ? ' - ' + ctx : '');
    },
    active: function(route) {
      return route === $location.path();
    }
  };

  $rootScope.instances = function() {
    return [1, 2, 3, 4];
  };

  $rootScope.username = function() {
    return User.user.name;
  };

  $rootScope.ternary = function(cond, a, b) {
    return cond ? a : b;
  };

  $rootScope.blocks = function(text) {
    return text ? text.split(/\n+/g) : [];
  };

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (document.getElementById("mystery-title").innerText.match(/A Mystery/)) {
      document.getElementById("mystery-title").innerText = "Do not use Google Translate";
    }
  });

  $rootScope.onShouldUpdateInbox = function(call) { // I don't know what I'm doing.
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      call();
    });
  };

  $rootScope.feedListeners = [];
  
  $rootScope.tellFeedListeners = function() {
    for (var i=0; i<$rootScope.feedListeners.length; i++) {
      $rootScope.feedListeners[i]();
    }
  };

  $rootScope.onShouldClearFeed = function(call) { // I don't know what I'm doing.
    $rootScope.feedListeners.push(call);
    $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
      if (next.originalPath == "/") {
        call();
      }
    });
  };

  var stashed = null;
  $rootScope.stash = function(value) {
    if (value === undefined) {
      value = stashed;
      stashed = null;
      return value;
    }
    stashed = value;
  };
});

app.run(function($locale) {
  $locale.id = 'es-es';
});
