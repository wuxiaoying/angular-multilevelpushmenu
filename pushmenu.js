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

(function () {
    var module;

    module = angular.module('wxy.pushmenu', ['ngAnimate', 'wxy.components']);

    module.directive('wxyPushMenu', [
      'wxyOptions', 'wxyUtils', function (wxyOptions, wxyUtils) {
          return {
              scope: {
                  menu: '=',
                  options: '='
              },
              controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                  var options, width;
                  $scope.options = options = angular.extend(wxyOptions, $scope.options);
                  $scope.level = 0;
                  $scope.visible = true;
                  $scope.collapsed = true;
                  width = options.menuWidth || 265;

                  //$element.find('nav').width(width + options.overlapWidth * wxyUtils.DepthOf($scope.menu.menu[0]));
                  this.GetBaseWidth = function () {
                      return width;
                  };
                  this.GetOptions = function () {
                      return options;
                  };
                  this.GetNavigationWidth = function () {
                      return (width + options.overlapWidth * wxyUtils.DepthOf($scope.menu.menu[0]));
                  };
				  
				  //Added to allow open sidebar navigation from outside 
                  $scope.$on('openSidebarNavigation', function (event) {
                  	$scope.openMenu(event, $scope.menu.menu);
                  });
              }],
              templateUrl: 'partials/MainMenu.html',
              restrict: 'E',
              replace: true
          };
      }
    ]);

    module.directive('wxySubmenu', [
      '$animate', 'wxyUtils', '$window', function ($animate, wxyUtils, $window) {
          return {
              scope: {
                  menu: '=',
                  level: '=',
                  visible: '=',
                  header: '='
              },
              link: function (scope, element, attr, ctrl) {
                  var collapse, marginCollapsed, onOpen, options;
                  scope.options = options = ctrl.GetOptions();
                  scope.childrenLevel = scope.level + 1;
                  //scope.$parent.collapsed = scope.collapsed;
                  onOpen = function () {
                      element.width(ctrl.GetBaseWidth());
                      if (!scope.collapsed) {
                          scope.inactive = false;
                      }
                      scope.$emit('submenuOpened', scope.level);
                  };
                  if (scope.level === 0) {
                      scope.$parent.openMenu = function (event, menu) {
                          scope.openMenu(event, menu);
                      };
                      scope.$parent.collapseAll = function (event, menu) {
                          scope.collapseAll(event, menu);
                      };
                      scope.onMenuHeaderClick = function (menu, event) {
                          wxyUtils.StopEventPropagation(event);
                          options.onMenuHeaderClick(event, menu);
                      };
                      scope.collasped = false;
                      marginCollapsed = -ctrl.GetBaseWidth();
                      if (options.collapsed) {
                          scope.collapsed = true;
                          scope.inactive = true;
                          var cssObj = {};
                          if (options.direction === 'ltr') {
                              cssObj['marginLeft'] = marginCollapsed;
                          }
                          else if (options.direction === 'rtl') {
                              cssObj['marginRight'] = marginCollapsed;
                          }
                          element.css(cssObj);
                      }
                      collapse = function () {
                          var animatePromise;
                          scope.collapsed = !scope.collapsed;
                          scope.inactive = scope.collapsed;
                          if (scope.collapsed) {
                              options.onCollapseMenuStart();

                          } else {
                              element.parent().width(ctrl.GetNavigationWidth()).height($window.innerHeight - 40);
                              angular.element('body').addClass('no-scroll');
                              scope.$parent.collapsed = false;
                              options.onExpandMenuStart();
                              if ($('cft-navigation-sidebar li.active').length > 0) {
                              	if (angular.element($('cft-navigation-sidebar li.active')).scope().$parent.$parent.level !== 0) {
                              		var selectedItem = angular.element($('cft-navigation-sidebar li.active')).scope().$parent.$parent.menu;
                                      selectedItem.visible = true;
                                      scope.inactive = true;
                                  }
                              }
                          }
                          animatePromise = $animate.addClass(element, 'slide', {
                              fromMargin: scope.collapsed ? 0 : marginCollapsed,
                              toMargin: scope.collapsed ? marginCollapsed : 0,
                              direction: options.direction
                          });
                          animatePromise.then(function () {
                              scope.$apply(function () {
                                  if (scope.collapsed) {
                                      element.parent().width(0);
                                      scope.$parent.collapsed = true;
                                      angular.element('body').removeClass('no-scroll');
                                      return options.onCollapseMenuEnd();
                                  } else {
                                      wxyUtils.setMenuScrollbar(element);
                                      return options.onExpandMenuEnd();
                                  }
                              });
                              return;
                          });
                          wxyUtils.PushContainers(options.containersToPush, scope.collapsed ? marginCollapsed : 0);
                      };
                  }
                  scope.openMenu = function (event, menu) {
                      wxyUtils.StopEventPropagation(event);
                      scope.$broadcast('menuOpened', scope.level);
                      options.onTitleItemClick(event, menu);
                      if (scope.level === 0 && !scope.inactive || scope.collapsed) {
                          collapse();
                      } else {
                          onOpen();
                      }
                  };

                  scope.collapseAll = function (event, menu) {
                      wxyUtils.StopEventPropagation(event);
                      if (scope.level === 0) {
                          if (!scope.inactive || !scope.collapsed) {
                              scope.$broadcast('menuOpened', scope.level);
                          }
                          else {
                              return;
                          }
                      }
                      scope.$emit('collapseAll', scope.level);
                  };

                  scope.onSubmenuClicked = function (item, $event) {
                      if (item.child) {
                          item.visible = true;
                          // Disable the inactive for now, which allows cover mode to work smoothly
                          // without flashing.  
                          // @todo Get a logic fork in here so it can be used in both modes.
                          //scope.inactive = true;
                          options.onGroupItemClick($event, item);
                      } else {
                          scope.collapseAll($event, item);
                          options.onItemClick($event, item);
                      }
                  };
                  scope.goBack = function (event, menu) {
                      wxyUtils.StopEventPropagation(event);
                      options.onBackItemClick(event, menu);
                      scope.visible = false;
                      return scope.$emit('submenuClosed', scope.level);
                  };
                  scope.$watch('visible', (function (_this) {
                      return function (visible) {
                          var animatePromise;
                          if (visible) {
                              if (scope.level > 0) {
                                  options.onExpandMenuStart();
                                  animatePromise = $animate.addClass(element, 'slide', {
                                      fromMargin: -ctrl.GetBaseWidth(),
                                      toMargin: 0,
                                      direction: options.direction
                                  });
                                  animatePromise.then(function () {
                                      scope.$apply(function () {
                                          wxyUtils.setMenuScrollbar(element);
                                          options.onExpandMenuEnd();
                                      });
                                  });
                              }
                              onOpen();
                          }
                          else {
                              if (scope.level > 0) {
                                  animatePromise = $animate.addClass(element, 'slide', {
                                      toMargin: -ctrl.GetBaseWidth(),
                                      fromMargin: 0,
                                      direction: options.direction
                                  });
                              }
                          }
                      };
                  })(this));
                  scope.$on('submenuOpened', (function (_this) {
                      return function (event, level) {
                          var correction, correctionWidth;
                          correction = level - scope.level;
                          correctionWidth = options.overlapWidth * correction;
                          element.width(ctrl.GetBaseWidth() + correctionWidth);
                          if (scope.level === 0) {
                              wxyUtils.PushContainers(options.containersToPush, correctionWidth);
                          }
                      };
                  })(this));
                  scope.$on('submenuClosed', (function (_this) {
                      return function (event, level) {
                          if (level - scope.level === 1) {
                              onOpen();
                              wxyUtils.StopEventPropagation(event);
                          }
                      };
                  })(this));
                  scope.$on('menuOpened', (function (_this) {
                      return function (event, level) {
                          if (scope.level - level > 0) {
                              scope.visible = false;
                          }
                      };
                  })(this));

                  scope.$on('collapseAll', (function (_this) {
                      return function (event, level) {
                          if (scope.level > 0) {
                              scope.visible = false;
                          }
                          else {
                              element.width(ctrl.GetBaseWidth());
                              collapse();
                          }
                      };
                  })(this));
              },
              templateUrl: 'partials/SubMenu.html',
              require: '^wxyPushMenu',
              restrict: 'EA',
              replace: true
          };
      }
    ]);

    module.factory('wxyUtils', ['$window', function ($window) {
        var DepthOf, PushContainers, StopEventPropagation, setMenuScrollbar;
        StopEventPropagation = function (e) {
            if (e.stopPropagation && e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            } else {
                e.cancelBubble = true;
                e.returnValue = false;
            }
        };
        DepthOf = function (menu) {
            var depth, item, maxDepth, _i, _len, _ref;
            maxDepth = 0;
            if (menu.child) {
                _ref = menu.child;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    if (item.child) {
                        depth = DepthOf(item.child) + 1;
                    }
                    if (depth > maxDepth) {
                        maxDepth = depth;
                    }
                }
            }
            return maxDepth;
        };
        PushContainers = function (containersToPush, absoluteDistance) {
            if (!containersToPush) {
                return;
            }
            return $.each(containersToPush, function () {
                return $(this).stop().animate({
                    marginLeft: absoluteDistance
                });
            });
        };
        setMenuScrollbar = function (element) {
            var windowHeight = angular.element($window).height() - 40;
            angular.forEach(element.find("ul"), function (value) {
                var a = angular.element(value);
                var sub = 57;
                angular.forEach(a.parent().children(), function (v) {
                    if (angular.element(v).prop('tagName').toLowerCase() !== 'ul') {
                        sub += angular.element(v).outerHeight(true);
                    }
                });
                var height = windowHeight - sub;
                a.css({
                    'height': height,
                    'overflow': 'auto',
                });
            });
        };
        return {
            StopEventPropagation: StopEventPropagation,
            DepthOf: DepthOf,
            PushContainers: PushContainers,
            setMenuScrollbar: setMenuScrollbar
        };
    }]);

    module.animation('.slide', function () {
        return {
            addClass: function (element, className, onAnimationCompleted, options) {
                element.removeClass('slide');
                var cssObj = {}, animateObj = {};
                if (options.direction === 'ltr') {
                    cssObj['marginLeft'] = options.fromMargin + 'px';
                    animateObj['marginLeft'] = options.toMargin + 'px';
                }
                else if (options.direction === 'rtl') {
                    cssObj['marginRight'] = options.fromMargin + 'px';
                    animateObj['marginRight'] = options.toMargin + 'px';
                }
                element.css(cssObj);
                element.animate(animateObj, onAnimationCompleted);
            }
        };
    });

    module.value('wxyOptions', {
        containersToPush: null,
        wrapperClass: 'multilevelpushmenu_wrapper',
        menuInactiveClass: 'multilevelpushmenu_inactive',
        menuWidth: 0,
        menuHeight: 0,
        collapsed: false,
        fullCollapse: true,
        direction: 'ltr',
        backText: 'Back',
        backItemClass: 'backItemClass',
        backItemIcon: 'fa fa-angle-left',
        groupIcon: 'fa fa-angle-right',
        mode: 'overlap',
        overlapWidth: 40,
        preventItemClick: true,
        preventGroupItemClick: true,
        swipe: 'both',
        onCollapseMenuStart: function () { },
        onCollapseMenuEnd: function () { },
        onExpandMenuStart: function () { },
        onExpandMenuEnd: function () { },
        onGroupItemClick: function () { },
        onItemClick: function () { },
        onTitleItemClick: function () { },
        onBackItemClick: function () { },
        onMenuReady: function () { },
        onMenuHeaderClick: function () { }
    });

}).call(this);
