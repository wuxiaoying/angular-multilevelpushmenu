module = angular.module 'main', ['ngAnimate', 'wxy.pushmenu']

module.controller 'MainCtrl', ['$scope', ($scope) ->
    $scope.menu = 
        title: 'All Categories'
        id: 'menuId'
        icon: 'fa fa-bars'
        items: [
            name: 'Devices'
            id: 'itemId'
            icon: 'fa fa-laptop'
            link: '#'
            menu: 
                title: 'Devices'
                icon: 'fa fa-laptop'
                items: [
                    name: 'Mobile Phones'
                    icon: 'fa fa-phone'
                    link: '#'
                    menu: 
                        title: 'Mobile Phones'
                        icon: 'fa fa-phone'
                        link: '#'
                        items: [
                            name: 'Super Smart Phone'
                            link: '#'
                        ,
                            name: 'Thin Magic Mobile'
                            link: '#' 
                        ,
                            name: 'Performance Crusher'
                            link: '#'
                        ,
                            name: 'Futuristic Experience'
                            link: '#'
                        ]
                ]
                 
        ]

    $scope.options =
        containersToPush: [$('#pushobj')]
    return
]