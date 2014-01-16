module = angular.module 'wxy.pushmenu', ['wxy.components']

module.directive 'wxyPushMenu', ['wxyOptions', 'wxyUtils', (wxyOptions, wxyUtils) ->
    scope: 
        menu: '='
        options: '='
    controller: ($scope, $element, $attrs) ->
        options = angular.extend wxyOptions, $scope.options
        $scope.level = 0
        $scope.visible = true

        # Calculate width 
        width = options.menuWidth || 265
        $element.find('.multilevelpushmenu_wrapper').width(width + options.overlapWidth * wxyUtils.DepthOf $scope.menu)

        this.GetBaseWidth = -> width
        this.GetOptions = -> options
        return
    templateUrl: 'Partials/MainMenu.html' 
    restrict: 'E'
    replace: true
]

module.directive 'wxySubmenu', ['wxyUtils', (wxyUtils) ->
    scope: 
        menu: '='
        level: '='
        visible: '='
    link: (scope, element, attr, ctrl) ->
        options = ctrl.GetOptions()
        
        onOpen = ->
            element.width ctrl.GetBaseWidth()
            scope.inactive = false
            scope.$emit 'submenuOpened', scope.level
            return

        scope.childrenLevel = scope.level + 1
            
        scope.openMenu = ->
            scope.$broadcast 'menuOpened', scope.level
            onOpen()
            return

        scope.onSubmenuClicked = (item) ->
            if item.menu
                item.visible = true
                scope.inactive = true
            return

        scope.goBack = ->
            scope.visible = false
            scope.$emit 'submenuClosed', scope.level

        scope.$watch 'visible', (visible) =>
            onOpen() if visible
            return

        scope.$on 'submenuOpened', (event, level) =>
            correction = level - scope.level
            correctionWidth = options.overlapWidth * correction
            element.width ctrl.GetBaseWidth() + correctionWidth
            wxyUtils.PushContainers options.containersToPush, correctionWidth if scope.level == 0
            return

        scope.$on 'submenuClosed', (event, level) =>
            if level - scope.level == 1
                onOpen()
                wxyUtils.StopEventPropagation event
            return

        scope.$on 'menuOpened', (event, level) =>
            scope.visible = false if scope.level - level > 0
            return

        return
    templateUrl: 'Partials/SubMenu.html'
    require: '^wxyPushMenu'
    restrict: 'E'
    replace: true
]

module.factory 'wxyUtils', ->
    StopEventPropagation = (e) ->
        if e.stopPropagation and e.preventDefault
            e.stopPropagation()
            e.preventDefault()
        else
            e.cancelBubble = true
            e.returnValue = false
        return

    DepthOf = (menu) ->
        maxDepth = 0
        if menu.items
            for item in menu.items
                depth = DepthOf(item.menu) + 1 if item.menu
                maxDepth = depth if depth > maxDepth
        maxDepth

    PushContainers = (containersToPush, absoluteDistance) ->
        return if not containersToPush
        $.each containersToPush, ->
            $(this).stop().animate
                marginLeft: absoluteDistance

    StopEventPropagation: StopEventPropagation
    DepthOf: DepthOf
    PushContainers: PushContainers

module.value 'wxyOptions', 
    container: null
    containersToPush: null
    menuId: null
    wrapperClass: 'multilevelpushmenu_wrapper'
    menuInactiveClass: 'multilevelpushmenu_inactive'
    menu: null
    menuWidth: 0
    menuHeight: 0
    collapsed: false
    fullCollapse: false
    direction: 'ltr'
    backText: 'Back'
    backItemClass: 'backItemClass'
    backItemIcon: 'fa fa-angle-right'
    groupIcon: 'fa fa-angle-left'
    mode: 'overlap'
    overlapWidth: 40
    preventItemClick: true
    preventGroupItemClick: true
    swipe: 'both'
    onCollapseMenuStart: ->
    onCollapseMenuEnd: ->
    onExpandMenuStart: ->
    onExpandMenuEnd: ->
    onGroupItemClick: ->
    onItemClick: ->
    onTitleItemClick: ->
    onBackItemClick: ->
    onMenuReady: ->


