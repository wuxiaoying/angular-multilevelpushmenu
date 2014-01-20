(function() {
  var module;

  module = angular.module('main', ['wxy.pushmenu']);

  module.controller('MainCtrl', [
    '$scope', function($scope) {
      $scope.menu = {
        title: 'All Categories',
        id: 'menuId',
        icon: 'fa fa-bars',
        items: [
          {
            name: 'Devices',
            id: 'itemId',
            icon: 'fa fa-laptop',
            link: '#',
            menu: {
              title: 'Devices',
              icon: 'fa fa-laptop',
              items: [
                {
                  name: 'Mobile Phones',
                  icon: 'fa fa-phone',
                  link: '#',
                  menu: {
                    title: 'Mobile Phones',
                    icon: 'fa fa-phone',
                    link: '#',
                    items: [
                      {
                        name: 'Super Smart Phone',
                        link: '#'
                      }, {
                        name: 'Thin Magic Mobile',
                        link: '#'
                      }, {
                        name: 'Performance Crusher',
                        link: '#'
                      }, {
                        name: 'Futuristic Experience',
                        link: '#'
                      }
                    ]
                  }
                }, {
                  name: 'Televisions',
                  icon: 'fa fa-desktop',
                  link: '#',
                  menu: {
                    title: 'Televisions',
                    icon: 'fa-fa-desktop',
                    link: '#',
                    items: [
                      {
                        name: 'Flat Super Screen',
                        link: '#'
                      }, {
                        name: 'Gigantic LED',
                        link: '#'
                      }, {
                        name: 'Power Eater',
                        link: '#'
                      }, {
                        name: '3D Experience',
                        link: '#'
                      }, {
                        name: 'Classic Comfort',
                        link: '#'
                      }
                    ]
                  }
                }, {
                  name: 'Cameras',
                  icon: 'fa fa-camera-retro',
                  link: '#',
                  menu: {
                    title: 'Camera',
                    icon: 'fa-fa-camera-retro',
                    link: '#',
                    items: [
                      {
                        name: 'Smart Shot',
                        link: '#'
                      }, {
                        name: 'Power Shooter',
                        link: '#'
                      }, {
                        name: 'Easy Photo Maker',
                        link: '#'
                      }, {
                        name: 'Super Pixel',
                        link: '#'
                      }
                    ]
                  }
                }
              ]
            }
          }, {
            name: 'Magazines',
            icon: 'fa fa-book',
            link: '#',
            menu: {
              title: 'Magazines',
              icon: 'fa fa-book',
              items: [
                {
                  name: 'National Geographics',
                  link: '#'
                }, {
                  name: 'Scientific American',
                  link: '#'
                }, {
                  name: 'The Spectator',
                  link: '#'
                }, {
                  name: 'Rambler',
                  link: '#'
                }, {
                  name: 'Physics World',
                  link: '#'
                }, {
                  name: 'The New Scientist',
                  link: '#'
                }
              ]
            }
          }, {
            name: 'Store',
            icon: 'fa fa-shopping-cart',
            link: '#',
            menu: {
              title: 'Store',
              icon: 'fa fa-shopping-cart',
              items: [
                {
                  name: 'Clothes',
                  icon: 'fa fa-tags',
                  link: '#',
                  menu: {
                    title: 'Clothes',
                    icon: 'fa fa-tags',
                    items: [
                      {
                        name: 'Women\'s Clothing',
                        icon: 'fa fa-female',
                        link: '#',
                        menu: {
                          title: 'Women\'s Clothing',
                          icon: 'fa fa-female',
                          items: [
                            {
                              name: 'Tops',
                              link: '#'
                            }, {
                              name: 'Dresses',
                              link: '#'
                            }, {
                              name: 'Trousers',
                              link: '#'
                            }, {
                              name: 'Shoes',
                              link: '#'
                            }, {
                              name: 'Sale',
                              link: '#'
                            }
                          ]
                        }
                      }, {
                        name: 'Men\'s Clothing',
                        icon: 'fa fa-male',
                        link: '#',
                        menu: {
                          title: 'Men\'s Clothing',
                          icon: 'fa fa-male',
                          items: [
                            {
                              name: 'Shirts',
                              link: '#'
                            }, {
                              name: 'Trousers',
                              link: '#'
                            }, {
                              name: 'Shoes',
                              link: '#'
                            }, {
                              name: 'Sale',
                              link: '#'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }, {
                  name: 'Jewelry',
                  link: '#'
                }, {
                  name: 'Music',
                  link: '#'
                }, {
                  name: 'Grocery',
                  link: '#'
                }
              ]
            }
          }, {
            name: 'Collections',
            link: '#'
          }, {
            name: 'Credits',
            link: '#'
          }
        ]
      };
      $scope.events = [];
      $scope.options = {
        containersToPush: [$('#pushobj')],
        direction: 'ltr',
        onExpandMenuStart: function() {
          $scope.events.push('Started expanding...');
        },
        onExpandMenuEnd: function() {
          $scope.events.push('Expanding ended!');
        },
        onCollapseMenuStart: function() {
          $scope.events.push('Started collapsing...');
        },
        onCollapseMenuEnd: function() {
          $scope.events.push('Collapsing ended!');
        },
        onGroupItemClick: function(event, item) {
          $scope.events.push('Group Item ' + item.name + ' clicked!');
        },
        onItemClick: function(event, item) {
          $scope.events.push('Item ' + item.name + ' clicked!');
        },
        onTitleItemClick: function(event, menu) {
          $scope.events.push('Title item ' + menu.title + ' clicked!');
        },
        onBackItemClick: function() {
          return $scope.events.push('Back item on ' + menu.title + ' menu level clicked!');
        }
      };
    }
  ]);

}).call(this);
