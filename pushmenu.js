(function() {
  var module;

  module = angular.module('wxy.pushmenu', ['wxy.components']);

  module.directive('wxyPushMenu', [
    'wxyOptions', 'wxyUtils', function(wxyOptions, wxyUtils) {
      return {
        scope: {
          menu: '=',
          options: '='
        },
        controller: function($scope, $element, $attrs) {
          var options, width;
          options = angular.extend(wxyOptions, $scope.options);
          $scope.level = 0;
          $scope.visible = true;
          width = options.menuWidth || 265;
          $element.find('.multilevelpushmenu_wrapper').width(width + options.overlapWidth * wxyUtils.DepthOf($scope.menu));
          this.GetBaseWidth = function() {
            return width;
          };
          this.GetOptions = function() {
            return options;
          };
        },
        templateUrl: 'Partials/MainMenu.html',
        restrict: 'E',
        replace: true
      };
    }
  ]);

  module.directive('wxySubmenu', [
    'wxyUtils', function(wxyUtils) {
      return {
        scope: {
          menu: '=',
          level: '=',
          visible: '='
        },
        link: function(scope, element, attr, ctrl) {
          var onOpen, options,
            _this = this;
          options = ctrl.GetOptions();
          onOpen = function() {
            element.width(ctrl.GetBaseWidth());
            scope.inactive = false;
            scope.$emit('submenuOpened', scope.level);
          };
          scope.childrenLevel = scope.level + 1;
          scope.openMenu = function() {
            scope.$broadcast('menuOpened', scope.level);
            onOpen();
          };
          scope.onSubmenuClicked = function(item) {
            if (item.menu) {
              item.visible = true;
              scope.inactive = true;
            }
          };
          scope.goBack = function() {
            scope.visible = false;
            return scope.$emit('submenuClosed', scope.level);
          };
          scope.$watch('visible', function(visible) {
            if (visible) {
              onOpen();
            }
          });
          scope.$on('submenuOpened', function(event, level) {
            var correction, correctionWidth;
            correction = level - scope.level;
            correctionWidth = options.overlapWidth * correction;
            element.width(ctrl.GetBaseWidth() + correctionWidth);
            if (scope.level === 0) {
              wxyUtils.PushContainers(options.containersToPush, correctionWidth);
            }
          });
          scope.$on('submenuClosed', function(event, level) {
            if (scope.level === 0 && !scope.out) {
              onOpen();
              wxyUtils.StopEventPropagation(event);
            }
          });
          scope.$on('menuOpened', function(event, level) {
            if (scope.level === 0 && !scope.inactive) {
              scope.$emit('slideOut');
            }
            if (scope.level - level > 0) {
              scope.visible = false;
            }
          });
          scope.$on('slideOut', function() {
            scope.out = !scope.out;
            wxyUtils.PushContainers(options.containersToPush, -225);
          });
        },
        templateUrl: 'Partials/SubMenu.html',
        require: '^wxyPushMenu',
        restrict: 'E',
        replace: true
      };
    }
  ]);

  module.factory('wxyUtils', function() {
    var DepthOf, PushContainers, StopEventPropagation;
    StopEventPropagation = function(e) {
      if (e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      } else {
        e.cancelBubble = true;
        e.returnValue = false;
      }
    };
    DepthOf = function(menu) {
      var depth, item, maxDepth, _i, _len, _ref;
      maxDepth = 0;
      if (menu.items) {
        _ref = menu.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.menu) {
            depth = DepthOf(item.menu) + 1;
          }
          if (depth > maxDepth) {
            maxDepth = depth;
          }
        }
      }
      return maxDepth;
    };
    PushContainers = function(containersToPush, absoluteDistance) {
      if (!containersToPush) {
        return;
      }
      return $.each(containersToPush, function() {
        return $(this).stop().animate({
          marginLeft: absoluteDistance
        });
      });
    };
    return {
      StopEventPropagation: StopEventPropagation,
      DepthOf: DepthOf,
      PushContainers: PushContainers
    };
  });

  module.value('wxyOptions', {
    container: null,
    containersToPush: null,
    menuId: null,
    wrapperClass: 'multilevelpushmenu_wrapper',
    menuInactiveClass: 'multilevelpushmenu_inactive',
    menu: null,
    menuWidth: 0,
    menuHeight: 0,
    collapsed: false,
    fullCollapse: false,
    direction: 'ltr',
    backText: 'Back',
    backItemClass: 'backItemClass',
    backItemIcon: 'fa fa-angle-right',
    groupIcon: 'fa fa-angle-left',
    mode: 'overlap',
    overlapWidth: 40,
    preventItemClick: true,
    preventGroupItemClick: true,
    swipe: 'both',
    onCollapseMenuStart: function() {},
    onCollapseMenuEnd: function() {},
    onExpandMenuStart: function() {},
    onExpandMenuEnd: function() {},
    onGroupItemClick: function() {},
    onItemClick: function() {},
    onTitleItemClick: function() {},
    onBackItemClick: function() {},
    onMenuReady: function() {}
  });

}).call(this);

(function () {
    var module;



    module = angular.module('wxy.components', []);

    module.directive('recursive', [
      '$compile', function ($compile) {
          return {
              restrict: 'EACM',
              priority: 100000,
              compile: function (tElement, tAttr) {
                  var compiledContents, contents;
                  contents = tElement.contents().remove();
                  compiledContents = null;
                  return function (scope, iElement, iAttr) {
                      if (!compiledContents) {
                          compiledContents = $compile(contents);
                      }
                      compiledContents(scope, function (clone, scope) {
                          return iElement.append(clone);
                      });
                  };
              }
          };
      }
    ]);

}).call(this);
